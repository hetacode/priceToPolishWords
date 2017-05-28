/*
 * 
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

const priceToArray = function (price) {
    price = price.toString()
            .replace(/[^\d,.]/g,"")          //"100.240,50zł" -> "100.240,50"
            .replace(/[.,](?!\d+$)|\.$/g,"") //"100.240,50"   -> "100240,50"
            .split(/[.,]/)                   //"100240,50"    -> ["100240","50"]
            .map((v,i) => (i===0) ? v : +(+((+v).toPrecision(2))+'').slice(0,2));
    if (!price.every(v => v >= 0 && v < 1e12)) {
        price = null;
    }
    return price;
};

const setPriceFormat = function (format) {
    /* 
     * price: 120,50zł
     * 
     * [zl_value_number] === "120"
     * [gr_value_number] === "50"
     * [full_value_number] === "120,50"
     * [zl_value_words] === "sto dwadzieścia"
     * [gr_value_words] === "pięćdziesiąt"
     * [zl_abbrev] === "zł"
     * [gr_abbrev] === "gr"
     * [gr_short] === "50/100"
     * [zl_full] = "złoty" / "złote" / "złotych"
     * [gr_full] = "grosz" / "grosze" / "groszy"
     */
    const formatToArray = (str) => str.match(/\[[a-z_]+\]/gi)
                                   .map(v => v.slice(1,-1)
                                   .replace(/(_)([a-z])/gi,(v,p1,p2) => p2.toUpperCase()));
    
    let defFormats = {
            typeA: "[zl_value_words] [zl_full] [gr_value_words] [gr_full]",
                   //sto dwadzieścia pięć złotych pięćdziesiąt groszy
                   
            typeB: '[zl_value_words] [zl_abbrev] [gr_value_words] [gr_abrev]',
                   //sto dwadzieścia pięć zł pięćdziesiąt gr
                   
            typeC: '[zl_value_words] [zl_abbrev] [gr_short]',
                   //sto dwadzieścia pięć zł 50/100
            
            typeD: '[zl_value_number] [zl_abbrev] [gr_value_number] [gr_abbrev]',
                   //120 zł 50 gr
                   
            typeE: "[full_value_number] [zl_abbrev]"
                   //120,50 zł
        },
        formatArr = formatToArray(defFormats.typeA);
    if (typeof format === 'string') {
    	let type = `type${format.toUpperCase()}`;
        if (defFormats.hasOwnProperty(type)) {
            formatArr = formatToArray(defFormats[type]);
        }
        else {
            let tmp = formatToArray(format);
            formatArr = (tmp.length) ? tmp : formatArr;
        }
        
    }
    return formatArr; //e.g: ["zlValueNumber", "zlAbbrev", "grValueNumber", "grAbbrev"]
};

const numberToWords = num => {
    num = +num;
    return (!num || num <= 0) ? 'zero' 
        : polishWords.reduce((words, [str, val]) => {
        let c = ~~(num / val);
        if (!c) return words;
        num %= val;
        return words + (val >= 1000 ? numberToWords(c) + ' ' : '') 
         + str + (num ? ` `: '');
    }, '').replace(/(n |[ay] |[ćm] )(tysiąc|milion|miliard)/g,(match, p1, p2) => {
        if (p2 === 'tysiąc') {
            switch(p1) {
                case 'n ': return p2;
                case 'a ':
                case 'y ': return `${p1}tysiące`;
                case 'ć ':
                case 'm ': return `${p1}tysięcy`;
            }
        }
        else {
            switch(p1) {
                case 'n ': return p2;
                case 'a ':
                case 'y ': return `${p1}${p2}y`;
                case 'ć ':
                case 'm ': return `${p1}${p2}ów`;
            }
        }
    });
};

const priceFormatMethods = {
    zlValueNumber (arr) {
        return arr[0];
    },
    
    grValueNumber (arr) {
        return (arr[1] < 10) ? `0${arr[1]}` : arr[1];
    },
    
    fullValueNumber (arr) {
        let zl = (arr[0]) ? arr[0] : '0',
            gr = (arr[1]) ? arr[1] : '0';
        return `${zl},${gr}`;
    },
    
    zlValueWords (arr) {
        return numberToWords(arr[0]);
    },
    
    grValueWords (arr) {
        return numberToWords(arr[1]);
    },
    
    zlAbbrev () {
        return "zł";
    },
    
    grAbbrev () {
        return "gr";
    },
    
    grShort (arr) {
        return `${this.grValueNumber(arr)}/100`;
    },
    
    zlFull (arr) {
        if (arr[0] === 1) { 
            return "złoty"; 
        }
        if (arr[0] >= 5 && arr[0] < 21) {
            return "złotych";
        }
        let zl = arr[0].toString().split('').slice(-1);
        if (/[234]/.test(zl)) { 
            return "złote"; 
        }
        else { 
            return "złotych"; 
        }
    },
    
    grFull (arr) {
        if (arr[1] === 1) {
            return "grosz";
        }
        if (arr[0] >= 5 && arr[0] < 21) {
            return "groszy";
        }
        let gr = arr[1].toString().split('').slice(-1);
        if (/[234]/.test(gr)) {
            return "grosze";
        }
        else {
            return "groszy";
        }
    },
};

//------------------------------------------------------------------------------
// Export class
//------------------------------------------------------------------------------
class PriceToWords {
    constructor (price) {
        this.priceArray = priceToArray(price);
    }
    
    getPrice (format) {
            format = setPriceFormat(format);
        let result = '';
        if (!this.priceArray) {
            return 'Podana kwota jest nieprawidłowa!';
        }
        for (let method of format) {
            result += priceFormatMethods[method](this.priceArray) + ' ';
        }
        return result.trim();
    }
}

export default PriceToWords;