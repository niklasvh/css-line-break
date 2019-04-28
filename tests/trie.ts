'use strict';

import {equal} from 'assert';
import {TrieBuilder, BITS_16, BITS_32, serializeBase64} from '../src/TrieBuilder';
import {createTrieFromBase64} from '../src/Trie';

const INITIAL = 0;
const ERROR = 1;

describe('TrieBuilder', () => {
    describe('should write value to Trie', () => {
        let builder: TrieBuilder = new TrieBuilder(INITIAL, ERROR);
        beforeEach(() => {
            builder = new TrieBuilder(INITIAL, ERROR);
            builder.set(0x5, 6);
            equal(builder.get(0x5), 6);
        });

        it('16 bit', () => {
            const trie = builder.freeze(BITS_16);
            equal(trie.get(0x5), 6);
        });

        it('32 bit', () => {
            const trie = builder.freeze(BITS_32);
            equal(trie.get(0x5), 6);
        });
    });

    describe('should write multiple values to Trie', () => {
        let builder: TrieBuilder = new TrieBuilder(INITIAL, ERROR);
        beforeEach(() => {
            builder = new TrieBuilder(INITIAL, ERROR);
            builder.set(0x6, 8);
            builder.set(0x7, 9);
            equal(builder.get(0x6), 8);
            equal(builder.get(0x7), 9);
        });

        it('16 bit', () => {
            const trie = builder.freeze(BITS_16);
            equal(trie.get(0x6), 8);
            equal(trie.get(0x7), 9);
        });

        it('32 bit', () => {
            const trie = builder.freeze(BITS_32);
            equal(trie.get(0x6), 8);
            equal(trie.get(0x7), 9);
        });
    });

    describe('should return initial value if unassigned', () => {
        let builder: TrieBuilder = new TrieBuilder(INITIAL, ERROR);
        beforeEach(() => {
            builder = new TrieBuilder(INITIAL, ERROR);
            builder.set(0x6, 8);
            builder.set(0x7, 9);
            equal(builder.get(0x6), 8);
            equal(builder.get(0x7), 9);
        });

        it('16 bit', () => {
            const trie = builder.freeze(BITS_16);
            equal(trie.get(0x6), 8);
            equal(trie.get(0x7), 9);
            equal(trie.get(0x8), INITIAL);
        });

        it('32 bit', () => {
            const trie = builder.freeze(BITS_32);
            equal(trie.get(0x6), 8);
            equal(trie.get(0x7), 9);
            equal(trie.get(0x8), INITIAL);
        });
    });

    describe('should set range', () => {
        let builder: TrieBuilder = new TrieBuilder(INITIAL, ERROR);
        beforeEach(() => {
            builder = new TrieBuilder(INITIAL, ERROR);
            builder.setRange(0x5, 0x10, 123);
            equal(builder.get(0x4), INITIAL);
            equal(builder.get(0x5), 123);
            equal(builder.get(0x7), 123);
            equal(builder.get(0x10), 123);
            equal(builder.get(0x11), INITIAL);
        });

        it('16 bit', () => {
            const trie = builder.freeze(BITS_16);
            equal(trie.get(0x4), INITIAL);
            equal(trie.get(0x5), 123);
            equal(trie.get(0x7), 123);
            equal(trie.get(0x10), 123);
            equal(trie.get(0x11), INITIAL);
        });

        it('32 bit', () => {
            const trie = builder.freeze(BITS_32);
            equal(trie.get(0x4), INITIAL);
            equal(trie.get(0x5), 123);
            equal(trie.get(0x7), 123);
            equal(trie.get(0x10), 123);
            equal(trie.get(0x11), INITIAL);
        });
    });

    describe('should serialize', () => {
        let builder: TrieBuilder = new TrieBuilder(INITIAL, ERROR);
        beforeEach(() => {
            builder = new TrieBuilder(INITIAL, ERROR);
            builder.setRange(0x1160, 0x11A7, 39);
            equal(builder.get(0x1159), INITIAL);
            equal(builder.get(0x1160), 39);
            equal(builder.get(0x1162), 39);
            equal(builder.get(0x11A7), 39);
            equal(builder.get(0x11A8), INITIAL);
        });

        it('16 bit', () => {
            const trie = builder.freeze(BITS_16);
            const base64 = serializeBase64(trie);
            const newTrie = createTrieFromBase64(base64);
            equal(newTrie.get(0x1159), INITIAL);
            equal(newTrie.get(0x1160), 39);
            equal(newTrie.get(0x1162), 39);
            equal(newTrie.get(0x11A7), 39);
            equal(newTrie.get(0x11A8), INITIAL);
        });

        it('32 bit', () => {
            const trie = builder.freeze(BITS_32);
            const base64 = serializeBase64(trie);
            const newTrie = createTrieFromBase64(base64);
            equal(newTrie.get(0x1159), INITIAL);
            equal(newTrie.get(0x1160), 39);
            equal(newTrie.get(0x1162), 39);
            equal(newTrie.get(0x11A7), 39);
            equal(newTrie.get(0x11A8), INITIAL);
        });
    });
});
