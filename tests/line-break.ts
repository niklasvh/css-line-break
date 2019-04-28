'use strict';
import {equal} from 'assert';
import {fromCodePoint, toCodePoints} from '../src/Util';
import {
    BREAK_ALLOWED, BREAK_MANDATORY, BREAK_NOT_ALLOWED, inlineBreakOpportunities,
    LINE_BREAK
} from '../src/LineBreak';

const breakTypes = [BREAK_MANDATORY, BREAK_NOT_ALLOWED, BREAK_ALLOWED].map(c => c.codePointAt(0));

const test = (str: string, lineBreak: LINE_BREAK) => {
    const codePoints: number[] = [];
    const breakPoints: number[] = [];

    toCodePoints(str).forEach((codePoint) => {
        if (breakTypes.indexOf(codePoint) === -1) {
            codePoints.push(codePoint);
        } else {
            breakPoints.push(codePoint);
        }
    });

    equal(inlineBreakOpportunities(fromCodePoint(...codePoints), {lineBreak}), str);
};

describe('CSS line-break', () => {
    describe('line-break: strict', () => {
        const lineBreak = 'strict';
        describe('line-break-strict-011.xht', () => {
            it('Japanese small kana: HIRAGANA LETTER SMALL A', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×ぁ÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('Japanese small kana: HIRAGANA LETTER SMALL I', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×ぃ÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('Japanese small kana: HIRAGANA LETTER SMALL U', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×ぅ÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('Japanese small kana: HIRAGANA LETTER SMALL E', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×ぇ÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('Japanese small kana: HIRAGANA LETTER SMALL O', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×ぉ÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });
        });

        describe('line-break-strict-012.xht', () => {
            it('Katakana-Hiragana prolonged sound mark - fullwidth', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×ー÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('Katakana-Hiragana prolonged sound mark - halfwidth', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×ｰ÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });
        });

        describe('line-break-strict-013.xht', () => {
            it('HYPHEN (U+2010)', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×‐÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('ENDASH (U+2013)', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×–÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('〜', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×〜÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('゠', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×゠÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });
        });

        describe('line-break-strict-014.xht', () => {
            it('IDEOGRAPHIC ITERATION MARK (U+3005)', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×々÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('VERTICAL IDEOGRAPHIC ITERATION MARK (U+3B)', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×〻÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('ゝ', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×ゝ÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('ゞ', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×ゞ÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('ヽ', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×ヽ÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('ヾ', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×ヾ÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });
        });

        describe('line-break-strict-015.xht', () => {
            it('inseparable characters TWO DOT LEADER', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×‥÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('inseparable characters HORIZONTAL ELLIPSIS', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×…÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });
        });

        describe('line-break-strict-016.xht', () => {
            it('centered punctuation marks COLON', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×:÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks SEMICOLON', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×;÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks KATAKANA MIDDLE DOT', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×・÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks FULLWIDTH COLON', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×：÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks FULLWIDTH SEMICOLON', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×；÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks HALFWIDTH KATAKANA MIDDLE DOT', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×･÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks QUESTION MARK', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×?÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks DOUBLE EXCLAMATION MARK', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×‼÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks DOUBLE QUESTION MARK', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×⁇÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks QUESTION EXCLAMATION MARK', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×⁈÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks EXCLAMATION QUESTION MARK', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×⁉÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks FULLWIDTH EXCLAMATION MARK', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×！÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks FULLWIDTH QUESTION MARK', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×？÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });
        });

        describe('line-break-strict-017.xht', () => {
            it('postfixes PERCENT SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×%÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('postfixes CENT SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×¢÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('postfixes DEGREE SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×°÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('postfixes PER MILLE SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×‰÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('postfixes PRIME', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×′÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('postfixes DOUBLE PRIME', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×″÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('postfixes DEGREE CELSIUS', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×℃÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('postfixes FULLWIDTH PERCENT SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×％÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('postfixes FULLWIDTH CENT SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×￠÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });
        });

        describe('line-break-strict-018.xht', () => {
            it('prefixes DOLLAR SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷$×サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('prefixes POUND SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷£×サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('prefixes YEN SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷¥×サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('prefixes EURO SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷€×サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('prefixes NUMERO SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷№×サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('prefixes FULLWIDTH DOLLAR SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷＄×サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('prefixes FULLWIDTH POUND SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷￡×サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('prefixes FULLWIDTH YEN SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷￥×サ÷ン÷プ÷ル÷文!', lineBreak);
            });
        });
    });
    describe('line-break: normal', () => {
        const lineBreak = 'normal';
        describe('breaks before hyphens', () => {
            it('HYPHEN (U+2010)', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷‐÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('ENDASH (U+2013)', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷–÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('〜', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷〜÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('゠', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷゠÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });
        });

        describe('line-break-normal-021.xht', () => {
            it('々', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×々÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('〻', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×〻÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('ゝ', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×ゝ÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('ゞ', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×ゞ÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('ヽ', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×ヽ÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('ヾ', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×ヾ÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });
        });

        describe('line-break-normal-022.xht', () => {
            it('inseparable characters TWO DOT LEADER', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×‥÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('inseparable characters HORIZONTAL ELLIPSIS', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×…÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });
        });

        describe('line-break-normal-023.xht', () => {
            it('centered punctuation marks COLON', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×:÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks SEMICOLON', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×;÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks KATAKANA MIDDLE DOT', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×・÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks FULLWIDTH COLON', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×：÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks FULLWIDTH SEMICOLON', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×；÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks HALFWIDTH KATAKANA MIDDLE DOT', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×･÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks QUESTION MARK', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×?÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks DOUBLE EXCLAMATION MARK', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×‼÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks DOUBLE QUESTION MARK', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×⁇÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks QUESTION EXCLAMATION MARK', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×⁈÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks EXCLAMATION QUESTION MARK', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×⁉÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks FULLWIDTH EXCLAMATION MARK', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×！÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('centered punctuation marks FULLWIDTH QUESTION MARK', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×？÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });
        });

        describe('line-break-normal-024.xht', () => {
            it('postfixes PERCENT SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×%÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('postfixes CENT SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×¢÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('postfixes DEGREE SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×°÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('postfixes PER MILLE SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×‰÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('postfixes PRIME', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×′÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('postfixes DOUBLE PRIME', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×″÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('postfixes DEGREE CELSIUS', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×℃÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('postfixes FULLWIDTH PERCENT SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×％÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('postfixes FULLWIDTH CENT SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文×￠÷サ÷ン÷プ÷ル÷文!', lineBreak);
            });
        });

        describe('line-break-normal-025.xht', () => {
            it('prefixes DOLLAR SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷$×サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('prefixes POUND SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷£×サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('prefixes YEN SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷¥×サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('prefixes EURO SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷€×サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('prefixes NUMERO SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷№×サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('prefixes FULLWIDTH DOLLAR SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷＄×サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('prefixes FULLWIDTH POUND SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷￡×サ÷ン÷プ÷ル÷文!', lineBreak);
            });

            it('prefixes FULLWIDTH YEN SIGN', () => {
                test('×サ÷ン÷プ÷ル÷文÷サ÷ン÷プ÷ル÷文÷￥×サ÷ン÷プ÷ル÷文!', lineBreak);
            });
        });
    });
});