export const toCodePoints = (str: string): number[] => {
    const codePoints = [];
    let i = 0;
    const length = str.length;
    while (i < length) {
        const value = str.charCodeAt(i++);
        if (value >= 0xd800 && value <= 0xdbff && i < length) {
            const extra = str.charCodeAt(i++);
            if ((extra & 0xfc00) === 0xdc00) {
                codePoints.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
            } else {
                codePoints.push(value);
                i--;
            }
        } else {
            codePoints.push(value);
        }
    }
    return codePoints;
};

export const fromCodePoint = (...codePoints: number[]): string => {
    if (String.fromCodePoint) {
        return String.fromCodePoint(...codePoints);
    }

    const length = codePoints.length;
    if (!length) {
        return '';
    }

    const codeUnits = [];

    let index = -1;
    let result = '';
    while (++index < length) {
        let codePoint = codePoints[index];
        if (codePoint <= 0xffff) {
            codeUnits.push(codePoint);
        } else {
            codePoint -= 0x10000;
            codeUnits.push((codePoint >> 10) + 0xd800, (codePoint % 0x400) + 0xdc00);
        }
        if (index + 1 === length || codeUnits.length > 0x4000) {
            result += String.fromCharCode(...codeUnits);
            codeUnits.length = 0;
        }
    }
    return result;
};

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

// Use a lookup table to find the index.
const lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}

export const decode = (base64: string): ArrayBuffer | number[] => {
    let bufferLength = base64.length * 0.75,
        len = base64.length,
        i,
        p = 0,
        encoded1,
        encoded2,
        encoded3,
        encoded4;

    if (base64[base64.length - 1] === '=') {
        bufferLength--;
        if (base64[base64.length - 2] === '=') {
            bufferLength--;
        }
    }

    const buffer =
        typeof ArrayBuffer !== 'undefined' &&
        typeof Uint8Array !== 'undefined' &&
        typeof Uint8Array.prototype.slice !== 'undefined'
            ? new ArrayBuffer(bufferLength)
            : new Array(bufferLength);
    const bytes = Array.isArray(buffer) ? buffer : new Uint8Array(buffer);

    for (i = 0; i < len; i += 4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];

        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    return buffer;
};

export const polyUint16Array = (buffer: number[]): number[] => {
    const length = buffer.length;
    const bytes = [];
    for (let i = 0; i < length; i += 2) {
        bytes.push((buffer[i + 1] << 8) | buffer[i]);
    }
    return bytes;
};

export const polyUint32Array = (buffer: number[]): number[] => {
    const length = buffer.length;
    const bytes = [];
    for (let i = 0; i < length; i += 4) {
        bytes.push((buffer[i + 3] << 24) | (buffer[i + 2] << 16) | (buffer[i + 1] << 8) | buffer[i]);
    }
    return bytes;
};
