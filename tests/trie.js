"use strict";

import assert from 'assert';
import {TrieBuilder, BITS_16, BITS_32} from '../src/TrieBuilder';

const INITIAL = 0;
const ERROR = 1;

describe('TrieBuilder', () => {
    describe('should write value to Trie', () => {
        let builder = null;
        beforeEach(() => {
            builder = new TrieBuilder(INITIAL, ERROR);
            builder.set(0x5, 6);
            assert.equal(builder.get(0x5), 6);
        });

        it('16 bit', () => {
            const trie = builder.freeze(BITS_16);
            assert.equal(trie.get(0x5), 6);
        });

        it('32 bit', () => {
            const trie = builder.freeze(BITS_32);
            assert.equal(trie.get(0x5), 6);
        });
    });

    describe('should write multiple values to Trie', () => {
        let builder = null;
        beforeEach(() => {
            builder = new TrieBuilder(INITIAL, ERROR);
            builder.set(0x6, 8);
            builder.set(0x7, 9);
            assert.equal(builder.get(0x6), 8);
            assert.equal(builder.get(0x7), 9);
        });

        it('16 bit', () => {
            const trie = builder.freeze(BITS_16);
            assert.equal(trie.get(0x6), 8);
            assert.equal(trie.get(0x7), 9);
        });

        it('32 bit', () => {
            const trie = builder.freeze(BITS_32);
            assert.equal(trie.get(0x6), 8);
            assert.equal(trie.get(0x7), 9);
        });
    });

    describe('should return initial value if unassigned', () => {
        let builder = null;
        beforeEach(() => {
            builder = new TrieBuilder(INITIAL, ERROR);
            builder.set(0x6, 8);
            builder.set(0x7, 9);
            assert.equal(builder.get(0x6), 8);
            assert.equal(builder.get(0x7), 9);
        });

        it('16 bit', () => {
            const trie = builder.freeze(BITS_16);
            assert.equal(trie.get(0x6), 8);
            assert.equal(trie.get(0x7), 9);
            assert.equal(trie.get(0x8), INITIAL);
        });

        it('32 bit', () => {
            const trie = builder.freeze(BITS_32);
            assert.equal(trie.get(0x6), 8);
            assert.equal(trie.get(0x7), 9);
            assert.equal(trie.get(0x8), INITIAL);
        });
    });

    describe('should set range', () => {
        let builder = null;
        beforeEach(() => {
            builder = new TrieBuilder(INITIAL, ERROR);
            builder.setRange(0x5, 0x10, 123);
            assert.equal(builder.get(0x4), INITIAL);
            assert.equal(builder.get(0x5), 123);
            assert.equal(builder.get(0x7), 123);
            assert.equal(builder.get(0x10), 123);
            assert.equal(builder.get(0x11), INITIAL);
        });

        it('16 bit', () => {
            const trie = builder.freeze(BITS_16);
            assert.equal(trie.get(0x4), INITIAL);
            assert.equal(trie.get(0x5), 123);
            assert.equal(trie.get(0x7), 123);
            assert.equal(trie.get(0x10), 123);
            assert.equal(trie.get(0x11), INITIAL);
        });

        it('32 bit', () => {
            const trie = builder.freeze(BITS_32);
            assert.equal(trie.get(0x4), INITIAL);
            assert.equal(trie.get(0x5), 123);
            assert.equal(trie.get(0x7), 123);
            assert.equal(trie.get(0x10), 123);
            assert.equal(trie.get(0x11), INITIAL);
        });
    });
});