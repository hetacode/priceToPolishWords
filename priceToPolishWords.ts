import { priceToArray } from "./src/priceToArray";
import { setPriceFormat } from "./src/setPriceFormat";
import { ConvertMethods } from "./src/ConvertMethods";

/**
 * Convert price (number) to words (polish)
 * @author Tomasz Sochacki - Drogimex Programming
 */

/**
 * Constructor with one or two arguments
 * 
 * @param {String} price Price as string, e.g. '120,50'
 * @param {String} errMsg [optional] Message for invalid price, default errMsg = 'Błędna kwota!'
 * @return {Object} Object instance of PriceToPolishWords with method getPrice()
 */
export class PriceToPolishWords {
    errMsg: string;
    priceArray: number[] | null;

    constructor(price: string | number, errMsg: string) {
        this.priceArray = (price) ? priceToArray(price) : null;
        this.errMsg = typeof errMsg === 'string' ? errMsg : 'Błędna kwota!';
    }

    /**
     * Method return price converted to polish words i given (or default) format
     * 
     * @param {String} format Rules to price format, default format is 'A'
     * @returns {String} Price converted to words (in given format)
     */
    getPrice(format: string) {
        let formatArr = setPriceFormat(format);
        const convert = new ConvertMethods(this.priceArray ?? []);
        let result = '';
        if (!this.priceArray) {
            return this.errMsg;
        }
        for (let method of formatArr ?? []) {
            try {
                result += (convert as any)[method]() + ' ';
            } catch (err) {
                return 'Invalid format!';
            }
        }
        return result.trim();
    }
}