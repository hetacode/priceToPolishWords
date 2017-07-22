/**
 * Function parsing price from user (argument for constructor PriceToPolishWord)
 * 
 * @param {String|Number} price
 * @return {Null|Array} If price is valid return array, when invalid return null
 */
const priceToArray = function ( price ) {
    price = price.toString();                          //'price' can be string or number
    price = price.replace( /[., ](?!\d+$)|\.$/g, '' ); //'1,120.50'   -> '1120.50'
    price = price.split( /[.,]/ );                     //'1120.50'    -> ['1120', '50']
    
    //Convert values to number:
    price = price.map( ( v, i ) => {
        //price[0] -> złote:
        if ( i === 0 ) {
            return +v;
        }
        //price[1] -> grosze:
        else {
            const val = v.toString().split( '' );
            if ( val.length < 3 ) {
                return +v;
            }
            const a = val[0];
            const b = ( +val[2] < 5 ) ? val[1] : +val[1] + 1;
            return +( a + b );
        }
    } );
       
    if ( !price.every( v => v >= 0 && v < 1e12 ) ) {
        return null;
    }
    if ( price.length === 1 ) {
        price.push( 0 ); //Add 'grosze'
    }
    return price; //e.g. [125,50]
};

module.exports = priceToArray;