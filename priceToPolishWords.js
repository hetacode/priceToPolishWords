/**
 * Convert price (number) to words (polish)
 * @author Tomasz Sochacki - Drogimex Programming
 */

const priceToArray = require( './src/priceToArray' );     //Function
const setPriceFormat = require( './src/setPriceFormat' ); //Function
const ConvertMethods = require( './src/ConvertMethods' ); //Class

/**
 * Constructor with one or two arguments
 * 
 * @param {String} price Price as string, e.g. '120,50'
 * @param {String} errMsg [optional] Message for invalid price, default errMsg = 'Błędna kwota!'
 * @return {Object} Object instance of PriceToPolishWords with method getPrice()
 */
class PriceToPolishWords {
    constructor ( price, errMsg ) {
        this.priceArray = ( price ) ? priceToArray( price ) : null;
        this.errMsg = typeof errMsg === 'string' ? errMsg : 'Błędna kwota!';
    }
    
    /**
     * Method return price converted to polish words i given (or default) format
     * 
     * @param {String} format Rules to price format, default format is 'A'
     * @returns {String} Price converted to words (in given format)
     */
    getPrice ( format ) {
        format = setPriceFormat( format );
        const convert = new ConvertMethods( this.priceArray );
        let result = '';
        if ( !this.priceArray ) {
            return this.errMsg;
        }
        for ( let method of format ) {
            try {
                result += convert[method]() + ' ';
            } catch ( err ) {
                return 'Invalid format!';
            }
        }
        return result.trim();
    }
}

module.exports = PriceToPolishWords;