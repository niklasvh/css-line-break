'use strict';
import assert from 'assert';
import {LineBreaker} from '../src/LineBreak';

describe('LineBreaker', () => {
    it('Should iterate breaks', () => {
        const breaker = LineBreaker('Lorem ipsum lol.');

        const words = [];
        let bk;

        while (!(bk = breaker.next()).done) {
            words.push(bk.value.slice());
        }

        assert.deepEqual(words, ['Lorem ', 'ipsum ', 'lol.']);
    });

    it('Works with options', () => {
        const breaker = LineBreaker('次の単語グレートブリテンおよび北アイルランド連合王国で本当に大きな言葉', {wordBreak: 'keep-all'});

        const words = [];
        let bk;

        while (!(bk = breaker.next()).done) {
            words.push(bk.value.slice());
        }


        assert.deepEqual(words, [
            '次の', '単語グ', 'レー', 'ト', 'ブ', 'リ', 'テ', 'ン',
            'お', 'よ', 'び', '北ア', 'イ', 'ル', 'ラ', 'ン', 'ド',
            '連合王国で', '本当に', '大き', 'な', '言葉'
        ]);
    })
});
