/* @flow */
'use strict';

import fs from 'fs';
import path from 'path';
import {classes, LETTER_NUMBER_MODIFIER} from '../src/LineBreak';
import {TrieBuilder, serializeBase64} from '../src/TrieBuilder';

const rawData = fs.readFileSync(path.resolve(__dirname, '../src/LineBreak.txt')).toString();
const builder = new TrieBuilder(classes.XX);

let rangeStart = null;
let rangeEnd = null;
let rangeType = null;

rawData
    .split('\n')
    .map(s => {
        const index = s.indexOf('#');
        const first = (index === -1 ? s : s.substring(0, index)).trim();
        return index === -1
            ? [first]
            : [
                  first,
                  s
                      .substring(index + 1)
                      .trim()
                      .split(/\s+/)[0]
                      .trim()
              ];
    })
    .filter(([s]) => s.length > 0)
    .forEach(([s, category]) => {
        const [input, type] = s.split(';');
        const [start, end] = input.split('..');
        const categoryType =
            ['Lu', 'Ll', 'Lt', 'Lm', 'Lo', 'Nd', 'Nl', 'No'].indexOf(category) !== -1
                ? LETTER_NUMBER_MODIFIER
                : 0;
        const classType = classes[type] + categoryType;
        if (!classType) {
            console.error(`Invalid class type "${type}" found`);
            process.exit(1);
        }

        const startInt = parseInt(start, 16);
        const endInt = end ? parseInt(end, 16) : startInt;
        if (classType === rangeType && startInt - 1 === rangeEnd) {
            rangeEnd = endInt;
        } else {
            if (rangeType && rangeStart !== null) {
                if (rangeStart !== rangeEnd && rangeEnd !== null) {
                    builder.setRange(rangeStart, rangeEnd, rangeType, true);
                } else {
                    builder.set(rangeStart, rangeType);
                }
            }
            rangeType = classType;
            rangeStart = startInt;
            rangeEnd = endInt;
        }
    });

const base64 = serializeBase64(builder.freeze(16));
fs.writeFileSync(
    path.resolve(__dirname, '../src/linebreak-trie.js'),
    `module.exports = "${base64}";`
);
console.log(base64, base64.length);
