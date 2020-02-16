import { polishWords } from "./polishWords";

class Private {
    /**
     * Method convert number to polish words, but without valid polish tails
     * e.g. 2000 -> 'dwa tysiąc'
     * 
     * @param {Number} num Number to convert to polish words
     * @return {String}
     */
    static numberToWords(num: number): string {
        num = +num;
        if (!num || num <= 0) {
            return 'zero';
        }
        return polishWords.reduce((words, [str, val]) => {
            const c = ~~(num / Number.parseFloat(val as string));
            ////e.g. 500 / 1000 = 0.5 -> ~~0.5 === 0 (false)
            //e.g. 500 / 200 = 2.5 -> ~~2.5 === 2 (true)

            if (!c) {
                return words;
            }
            num %= Number.parseFloat(val as string);
            return words + (val >= 1000 ? Private.numberToWords(c) + ' ' : '') + str + (num ? ' ' : '');
        }, '');
    }

    /**
     * Method adds polish tails, e.g. 'dwa tysiąc' -> 'dwa tysiące'
     * 
     * @param {String} numberAsWords String from method numberToWords
     * @returns {String}
     */
    static addTails(numberAsWords: string) {
        return numberAsWords.replace(/(n |[ay] |[ćm] )(tysiąc|milion|miliard)/g, (match, p1, p2) => {
            if (p2 === 'tysiąc') {
                switch (p1) {
                    case 'n ': return p2;
                    case 'a ':
                    case 'y ': return `${p1}tysiące`;
                    case 'ć ':
                    case 'm ': return `${p1}tysięcy`;
                }
            }
            else {
                switch (p1) {
                    case 'n ': return p2;
                    case 'a ':
                    case 'y ': return `${p1}${p2}y`;
                    case 'ć ':
                    case 'm ': return `${p1}${p2}ów`;
                }
            }
        });
    }
}

/**
 * Function convert number to polish words
 * number have to be >= 0 && < 1e12 (max range in array "polishWords")
 * 
 * @param {Number|String} num Number to convert to polish words
 * @return {String} Words reprezentation of number
 */
export const numberToWords = (number: number | string) => {
    let result = Private.numberToWords(+number);
    return Private.addTails(result);
};