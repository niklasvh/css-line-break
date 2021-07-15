import {decode, polyUint16Array, polyUint32Array} from './Util';

export type int = number;

/** Shift size for getting the index-2 table offset. */
export const UTRIE2_SHIFT_2 = 5;

/** Shift size for getting the index-1 table offset. */
export const UTRIE2_SHIFT_1 = 6 + 5;

/**
 * Shift size for shifting left the index array values.
 * Increases possible data size with 16-bit index values at the cost
 * of compactability.
 * This requires data blocks to be aligned by UTRIE2_DATA_GRANULARITY.
 */
export const UTRIE2_INDEX_SHIFT = 2;

/**
 * Difference between the two shift sizes,
 * for getting an index-1 offset from an index-2 offset. 6=11-5
 */
export const UTRIE2_SHIFT_1_2 = UTRIE2_SHIFT_1 - UTRIE2_SHIFT_2;

/**
 * The part of the index-2 table for U+D800..U+DBFF stores values for
 * lead surrogate code _units_ not code _points_.
 * Values for lead surrogate code _points_ are indexed with this portion of the table.
 * Length=32=0x20=0x400>>UTRIE2_SHIFT_2. (There are 1024=0x400 lead surrogates.)
 */
export const UTRIE2_LSCP_INDEX_2_OFFSET = 0x10000 >> UTRIE2_SHIFT_2;

/** Number of entries in a data block. 32=0x20 */
export const UTRIE2_DATA_BLOCK_LENGTH = 1 << UTRIE2_SHIFT_2;
/** Mask for getting the lower bits for the in-data-block offset. */
export const UTRIE2_DATA_MASK = UTRIE2_DATA_BLOCK_LENGTH - 1;

export const UTRIE2_LSCP_INDEX_2_LENGTH = 0x400 >> UTRIE2_SHIFT_2;
/** Count the lengths of both BMP pieces. 2080=0x820 */
export const UTRIE2_INDEX_2_BMP_LENGTH = UTRIE2_LSCP_INDEX_2_OFFSET + UTRIE2_LSCP_INDEX_2_LENGTH;
/**
 * The 2-byte UTF-8 version of the index-2 table follows at offset 2080=0x820.
 * Length 32=0x20 for lead bytes C0..DF, regardless of UTRIE2_SHIFT_2.
 */
export const UTRIE2_UTF8_2B_INDEX_2_OFFSET = UTRIE2_INDEX_2_BMP_LENGTH;
export const UTRIE2_UTF8_2B_INDEX_2_LENGTH = 0x800 >> 6; /* U+0800 is the first code point after 2-byte UTF-8 */
/**
 * The index-1 table, only used for supplementary code points, at offset 2112=0x840.
 * Variable length, for code points up to highStart, where the last single-value range starts.
 * Maximum length 512=0x200=0x100000>>UTRIE2_SHIFT_1.
 * (For 0x100000 supplementary code points U+10000..U+10ffff.)
 *
 * The part of the index-2 table for supplementary code points starts
 * after this index-1 table.
 *
 * Both the index-1 table and the following part of the index-2 table
 * are omitted completely if there is only BMP data.
 */
export const UTRIE2_INDEX_1_OFFSET = UTRIE2_UTF8_2B_INDEX_2_OFFSET + UTRIE2_UTF8_2B_INDEX_2_LENGTH;

/**
 * Number of index-1 entries for the BMP. 32=0x20
 * This part of the index-1 table is omitted from the serialized form.
 */
export const UTRIE2_OMITTED_BMP_INDEX_1_LENGTH = 0x10000 >> UTRIE2_SHIFT_1;

/** Number of entries in an index-2 block. 64=0x40 */
export const UTRIE2_INDEX_2_BLOCK_LENGTH = 1 << UTRIE2_SHIFT_1_2;
/** Mask for getting the lower bits for the in-index-2-block offset. */
export const UTRIE2_INDEX_2_MASK = UTRIE2_INDEX_2_BLOCK_LENGTH - 1;

const slice16 = (view: number[] | Uint16Array, start: number, end?: number) => {
    if (view.slice) {
        return view.slice(start, end);
    }

    return new Uint16Array(Array.prototype.slice.call(view, start, end));
};

const slice32 = (view: number[] | Uint32Array, start: number, end?: number) => {
    if (view.slice) {
        return view.slice(start, end);
    }

    return new Uint32Array(Array.prototype.slice.call(view, start, end));
};

export const createTrieFromBase64 = (base64: string): Trie => {
    const buffer = decode(base64);
    const view32 = Array.isArray(buffer) ? polyUint32Array(buffer) : new Uint32Array(buffer);
    const view16 = Array.isArray(buffer) ? polyUint16Array(buffer) : new Uint16Array(buffer);
    const headerLength = 24;

    const index = slice16(view16, headerLength / 2, view32[4] / 2);
    const data =
        view32[5] === 2
            ? slice16(view16, (headerLength + view32[4]) / 2)
            : slice32(view32, Math.ceil((headerLength + view32[4]) / 4));

    return new Trie(view32[0], view32[1], view32[2], view32[3], index, data);
};

export class Trie {
    initialValue: int;
    errorValue: int;
    highStart: int;
    highValueIndex: int;
    index: Uint16Array | number[];
    data: Uint32Array | Uint16Array | number[];

    constructor(
        initialValue: int,
        errorValue: int,
        highStart: int,
        highValueIndex: int,
        index: Uint16Array | number[],
        data: Uint32Array | Uint16Array | number[]
    ) {
        this.initialValue = initialValue;
        this.errorValue = errorValue;
        this.highStart = highStart;
        this.highValueIndex = highValueIndex;
        this.index = index;
        this.data = data;
    }

    /**
     * Get the value for a code point as stored in the Trie.
     *
     * @param codePoint the code point
     * @return the value
     */
    get(codePoint: number): number {
        let ix;
        if (codePoint >= 0) {
            if (codePoint < 0x0d800 || (codePoint > 0x0dbff && codePoint <= 0x0ffff)) {
                // Ordinary BMP code point, excluding leading surrogates.
                // BMP uses a single level lookup.  BMP index starts at offset 0 in the Trie2 index.
                // 16 bit data is stored in the index array itself.
                ix = this.index[codePoint >> UTRIE2_SHIFT_2];
                ix = (ix << UTRIE2_INDEX_SHIFT) + (codePoint & UTRIE2_DATA_MASK);
                return this.data[ix];
            }

            if (codePoint <= 0xffff) {
                // Lead Surrogate Code Point.  A Separate index section is stored for
                // lead surrogate code units and code points.
                //   The main index has the code unit data.
                //   For this function, we need the code point data.
                // Note: this expression could be refactored for slightly improved efficiency, but
                //       surrogate code points will be so rare in practice that it's not worth it.
                ix = this.index[UTRIE2_LSCP_INDEX_2_OFFSET + ((codePoint - 0xd800) >> UTRIE2_SHIFT_2)];
                ix = (ix << UTRIE2_INDEX_SHIFT) + (codePoint & UTRIE2_DATA_MASK);
                return this.data[ix];
            }

            if (codePoint < this.highStart) {
                // Supplemental code point, use two-level lookup.
                ix = UTRIE2_INDEX_1_OFFSET - UTRIE2_OMITTED_BMP_INDEX_1_LENGTH + (codePoint >> UTRIE2_SHIFT_1);
                ix = this.index[ix];
                ix += (codePoint >> UTRIE2_SHIFT_2) & UTRIE2_INDEX_2_MASK;
                ix = this.index[ix];
                ix = (ix << UTRIE2_INDEX_SHIFT) + (codePoint & UTRIE2_DATA_MASK);
                return this.data[ix];
            }
            if (codePoint <= 0x10ffff) {
                return this.data[this.highValueIndex];
            }
        }

        // Fall through.  The code point is outside of the legal range of 0..0x10ffff.
        return this.errorValue;
    }
}
