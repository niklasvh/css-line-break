/* @flow */
'use strict';

import http from 'http';
import fs from 'fs';
import path from 'path';
import {classes} from '../src/LineBreak';
import {TrieBuilder, serializeBase64} from '../src/TrieBuilder';

const url = 'http://www.unicode.org/Public/10.0.0/ucd/LineBreak.txt';

http
    .get(url, res => {
        const {statusCode} = res;

        if (statusCode !== 200) {
            console.error(`Request Failed. Status Code: ${statusCode}`);
            process.exit(1);
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', chunk => {
            rawData += chunk;
        });
        res.on('end', () => {
            const builder = new TrieBuilder(classes.XX);

            let rangeStart = null;
            let rangeEnd = null;
            let rangeType = null;

            rawData
                .split('\n')
                .map(s => {
                    const index = s.indexOf('#');
                    return (index === -1 ? s : s.substring(0, index)).trim();
                })
                .filter(s => s.length > 0)
                .forEach(s => {
                    const [input, type] = s.split(';');
                    const [start, end] = input.split('..');
                    const classType = classes[type];
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
        });
    })
    .on('error', e => {
        console.error(`Got error: ${e.message}`);
        process.exit(1);
    });
