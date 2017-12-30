'use strict';
import assert from 'assert';
import {fromCodePoint, toCodePoints} from '../src/Util';
import {BREAK_ALLOWED, BREAK_MANDATORY, BREAK_NOT_ALLOWED, inlineBreakOpportunities} from '../src/LineBreak';

const breakTypes = [BREAK_MANDATORY, BREAK_NOT_ALLOWED, BREAK_ALLOWED].map(c => c.codePointAt(0));

const test = (str, wordBreak) => {
    const codePoints = [];
    const breakPoints = [];
    let index = 0;

    toCodePoints(str).forEach((codePoint) => {
        if (breakTypes.indexOf(codePoint) === -1) {
            codePoints.push(codePoint);
            index++;
        } else {
            breakPoints.push(codePoint);
        }
    });

    assert.equal(inlineBreakOpportunities(fromCodePoint(...codePoints), {wordBreak, lineBreak: 'normal'}), str);
};

describe('CSS word-break', () => {
    describe('word-break: normal', () => {
        const wordBreak = 'normal';
        it('word-break-break-all-000.html', () => {
            test('×l×a×t×i×n×l×a×t×i×n×l×a×t×i×n×​÷l×a×t×i×n!', wordBreak);
        });

        describe('word-break-normal-002.xht', () => {
            it('1', () => {
                test('×F×i×l×l×e×r× ÷T×e×x×t× ÷F×i×l×l×e×r× ÷T×e×x×t× ÷F×i×l×l×e×r× ÷T×e×x×t!', wordBreak);
            });
            it('2', () => {
                test('×満÷た÷す÷た÷め÷の÷文÷字× ÷F×i×l×l×e×r× ÷T×e×x×t!', wordBreak);
            });
            it('3', () => {
                test('×満÷た÷す÷た÷め÷の÷文÷字÷満÷た÷す÷た÷め÷の÷文÷字!', wordBreak);
            });
        });

        it('sample', () => {
            // TODO fix Thai line breaking
            test('×这÷是÷一÷些÷汉÷字×,× ÷a×n×d× ÷s×o×m×e× ÷L×a×t×i×n×,× ÷و× ÷ک×م×ی× ÷ن×و×ش×ت×ن× ÷ع×ر×ب×ی×,×แ×ล×ะ×ต×ั×ว×อ×ย×่×า×ง×ก×า×ร×เ×ข×ี×ย×น×ภ×า×ษ×า×ไ×ท×ย×.!', wordBreak);
        });
    });

    describe('word-break: break-all', () => {
        const wordBreak = 'break-all';
        it('word-break-break-all-000.html', () => {
            test('×日÷本÷語÷日÷本÷語÷日÷本÷語!', wordBreak);
        });

        it('word-break-break-all-001.html', () => {
            test('×L÷a÷t÷i÷n× ÷l÷a÷t÷i÷n× ÷l÷a÷t÷i÷n× ÷l÷a÷t÷i÷n!', wordBreak);
        });

        it('word-break-break-all-002.html', () => {
            test('×한÷글÷이× ÷한÷글÷이× ÷한÷글÷이!', wordBreak);
        });

        it('word-break-break-all-003.html', () => {
            test('×ภ÷า÷ษ÷า÷ไ÷ท÷ย÷ภ÷า÷ษ÷า÷ไ÷ท÷ย!', wordBreak);
        });

        it('sample', () => {
            test('×这÷是÷一÷些÷汉÷字×,× ÷a÷n÷d× ÷s÷o÷m÷e× ÷L÷a÷t÷i÷n×,× ÷و× ÷ک÷م÷ی× ÷ن÷و÷ش÷ت÷ن× ÷ع÷ر÷ب÷ی×,× ÷แ÷ล÷ะ÷ต÷ั÷ว÷อ÷ย÷่÷า÷ง÷ก÷า÷ร÷เ÷ข÷ี÷ย÷น÷ภ÷า÷ษ÷า÷ไ÷ท÷ย×.!', wordBreak);
        });
    });

    describe('line-break: keep-all', () => {
        const wordBreak = 'keep-all';
        it('sample', () => {
            // TODO fix Thai line breaking
            test('×这×是×一×些×汉×字×,× ÷a×n×d× ÷s×o×m×e× ÷L×a×t×i×n×,× ÷و× ÷ک×م×ی× ÷ن×و×ش×ت×ن× ÷ع×ر×ب×ی×,×แ×ล×ะ×ต×ั×ว×อ×ย×่×า×ง×ก×า×ร×เ×ข×ี×ย×น×ภ×า×ษ×า×ไ×ท×ย×.!', wordBreak);
        });
    });
});