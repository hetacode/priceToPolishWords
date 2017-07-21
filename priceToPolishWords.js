/**
 * Convert price (number) to words (polish)
 * @author Tomasz Sochacki - Drogimex Programming
 */

//------------------------------------------------------------------------------
// Private variables and functions (not exported)
//------------------------------------------------------------------------------
const polishWords = [
    ['miliard', 1e9],
    ['milion', 1e6],
    ['tysiąc', 1e3],
    ['dziewięćset', 900],
    ['osiemset', 800],
    ['siedemset', 700],
    ['sześćset', 600],
    ['pięćset', 500],
    ['czterysta', 400],
    ['trzysta', 300],
    ['dwieście', 200],
    ['sto', 100],
    ['dziewięćdziesiąt', 90],
    ['osiemdziesiąt', 80],
    ['siedemdziesiąt', 70],
    ['sześćdziesiąt', 60],
    ['pięćdziesiąt', 50],
    ['czterdzieści', 40],
    ['trzydzieści', 30],
    ['dwadzieścia', 20],
    ['dziewiętnaście', 19],
    ['osiemnaście', 18],
    ['siedemnaście', 17],
    ['szesnaście', 16],
    ['piętnaście', 15],
    ['czternaście', 14],
    ['trzynaście', 13],
    ['dwanaście', 12],
    ['jedenaście', 11],
    ['dziesięć', 10],
    ['dziewięć', 9],
    ['osiem', 8],
    ['siedem', 7],
    ['sześć', 6], 
    ['pięć', 5],
    ['cztery', 4],
    ['trzy', 3],
    ['dwa', 2],
    ['jeden', 1]
];

/**
 * Function parsing price from user (argument for constructor PriceToPolishWord)
 * 
 * @param {string|number} price
 * @return {null|array} If price is valid return array, when invalid return null
 */
const priceToArray = function ( price ) {
    price = price.toString();                          //'price' can be string or number
    price = price.replace( /[., ](?!\d+$)|\.$/g, '' ); //'1,120.50'   -> '1120.50'
    price = price.split( /[.,]/ );                     //'1120.50'    -> ['1120', '50']
    
    //Convert values to number:
    price = price.map( ( v, i ) => {
        //price[0] -> złote:
        if ( i === 0 ) {
            return +v; //For ",50" is ['', '50'] -> "zlote": (+'' === 0)
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
    return price;
};

/**
 * Function is getting rules for price formatting.
 * For invalid rules function return default formatting rules.
 * 
 * @param {string} Rules formatting returned value
 * @return {array} Array of the formatting methods
 */
const setPriceFormat = function ( formatRules ) {
    /**
     * Example price: "125,50zł"
     * 
     * zl-number === "125"
     * gr-number === "50"
     * zl-words === "sto dwadzieścia pięć"
     * gr-words === "pięćdziesiąt"
     * zl === "zł"
     * gr === "gr"
     * gr-short === "50/100"
     * zl-full === "złoty" || "złote"  || "złotych"
     * gr-full === "grosz" || "grosze" || "groszy"
     */
    
    /*
     * Function convert rules (e.g. 'zl-words') to valid convertion method names
     * 
     * @param {string} User formatting rules as string 
     * @return {array} For example: [zlWords, zlFull, ...]
     */
    const formatRulesToMethodName = function ( str ) {
        let rulesToArray = str.match( /[-a-z]+/gi ); //'zl-words zl' -> ['zl-words', 'zl']
        return rulesToArray.map( oneRule => {
            return oneRule.replace( /(-)([a-z])/gi, ( match, p1, p2 ) => {
                return p2.toUpperCase(); //'zl-words' -> 'zlWords'
            } );
        } ); //['zl-words', 'zl'] -> ['zlWords', 'zl']
    };
    
    const defaultFormats = {
        typeA: 'zl-words zl-full gr-words gr-full', //sto dwadzieścia pięć złotych pięćdziesiąt groszy
        typeB: 'zl-words zl gr-words gr', //sto dwadzieścia pięć zł pięćdziesiąt gr
        typeC: 'zl-words zl gr-short', //sto dwadzieścia pięć zł 50/100
        typeD: 'zl-number zl gr-number gr' //125 zł 50 gr
    };
    
    //In first instance set default rules (typeA)
    let formatRulesArray = formatRulesToMethodName( defaultFormats.typeA );
    
    if ( typeof formatRules === 'string' ) {
        if ( formatRules.length === 1 ) {
            let type = `type${formatRules.toUpperCase()}`;
            if ( defaultFormats.hasOwnProperty( type ) ) {
                formatRulesArray = formatRulesToMethodName( defaultFormats[type] );
            }
        }
        else {
            let tmp = formatRulesToMethodName( formatRules );
            formatRulesArray = ( tmp.length ) ? tmp : formatRulesArray;
        }
    }
    else if ( typeof formatRules !== 'undefined' ) {
        formatRulesArray = [''];
    }
    
    return formatRulesArray; //e.g: ['zlWords', 'zl', 'grWords', 'gr']
};

const numberToWords = num => {
    num = +num;
    if ( !num || num <= 0 ) {
        return 'zero';
    }
    return polishWords.reduce( ( words, [str, val] ) => {
        const c = ~~( num / val );
        if ( !c ) {
            return words;
        }
        num %= val;
        return words + ( val >= 1000 ? numberToWords( c ) + ' ' : '' ) + str + ( num ? ' ': '' );
    }, '' ).replace( /(n |[ay] |[ćm] )(tysiąc|milion|miliard)/g,( match, p1, p2 ) => {
        if ( p2 === 'tysiąc' ) {
            switch( p1 ) {
            case 'n ': return p2;
            case 'a ':
            case 'y ': return `${p1}tysiące`;
            case 'ć ':
            case 'm ': return `${p1}tysięcy`;
            }
        }
        else {
            switch( p1 ) {
            case 'n ': return p2;
            case 'a ':
            case 'y ': return `${p1}${p2}y`;
            case 'ć ':
            case 'm ': return `${p1}${p2}ów`;
            }
        }
    } );
};

class ConvertMethods {
    constructor ( priceAsArray ) {
        this.price = priceAsArray;
    }
    zlNumber () {
        return this.price[0];
    }
    
    grNumber () {
        return ( this.price[1] < 10 ) ? `0${this.price[1]}` : this.price[1];
    }
    
    zlWords () {
        return numberToWords( this.price[0] );
    }
    
    grWords () {
        return numberToWords( this.price[1] );
    }
    
    zl () {
        return 'zł';
    }
    
    gr () {
        return 'gr';
    }
    
    grShort () {
        return `${this.grNumber( this.price )}/100`;
    }
    
    zlFull () {
        if ( this.price[0] === 1 ) { 
            return 'złoty'; 
        }
        if ( this.price[0] >= 5 && this.price[0] < 21 ) {
            return 'złotych';
        }
        let zl = this.price[0].toString().split( '' ).slice( -1 );
        if ( /[234]/.test( zl ) ) { 
            return 'złote'; 
        }
        else { 
            return 'złotych'; 
        }
    }
    
    grFull () {
        if ( this.price[1] === 1 ) {
            return 'grosz';
        }
        if ( this.price[0] === 0 || ( this.price[0] >= 5 && this.price[0] < 21 ) ) {
            return 'groszy';
        }
        let gr = this.price[1].toString().split( '' ).slice( -1 );
        if ( /[234]/.test( gr ) ) {
            return 'grosze';
        }
        else {
            return 'groszy';
        }
    }
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------
class PriceToPolishWords {
    constructor ( price, errMsg ) {
        this.priceArray = ( price ) ? priceToArray( price ) : null;
        this.errMsg = typeof errMsg === 'string' ? errMsg : 'Błędna kwota!';
    }
    
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