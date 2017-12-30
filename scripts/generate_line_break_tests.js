/* @flow */
'use strict';

import fs from 'fs';
import path from 'path';
import {BREAK_MANDATORY, BREAK_NOT_ALLOWED, BREAK_ALLOWED} from '../src/LineBreak';

const data = fs.readFileSync(path.resolve(__dirname, '../tests/LineBreakTest.txt')).toString();
const tests = [];
data
    .split('\n')
    .filter(s => s.length > 0)
    .forEach(s => {
        let [input, comment] = s.split('#');
        input = input.trim();

        if (input.length) {
            comment = comment ? comment.trim() : '';
            const inputs = input.split(/\s+/g);
            const codePoints = [];
            const breaks = [];
            inputs.forEach((input, i) => {
                if ([BREAK_ALLOWED, BREAK_MANDATORY, BREAK_NOT_ALLOWED].indexOf(input) !== -1) {
                    breaks.push(input);
                } else {
                    codePoints.push(`0x${input}`);
                }
            });
            tests.push(
                `it('${comment}', () => test([${codePoints.join(', ')}], ${JSON.stringify(
                    breaks
                )}));`
            );
        }
    });

const template = `// Generated tests from LineBreakTest.txt, do NOT modify
'use strict';
import assert from 'assert';
import {lineBreakAtIndex, codePointsToCharacterClasses, BREAK_MANDATORY, BREAK_ALLOWED} from '../src/LineBreak';

const test = (codePoints, breaks) => {
    breaks.forEach((c, i) => {
		const b = lineBreakAtIndex(codePoints, i).replace(BREAK_MANDATORY, BREAK_ALLOWED);
		assert.equal(b, c, \`\${b} at \${i}, expected \${c} with \${codePointsToCharacterClasses(codePoints)}\`);
	});
};

describe('LineBreakTest.txt', () => {
    ${tests.join('\n    ')}
});
`;

fs.writeFileSync(path.resolve(__dirname, '../tests/linebreak.js'), template);
