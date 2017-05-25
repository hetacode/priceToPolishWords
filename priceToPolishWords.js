/*
 * 
 */

//------------------------------------------------------------------------------
// Private variables and functions (not exported)
//------------------------------------------------------------------------------
const polishWords = [];

const priceToNumber = function (price) {
    let p = price;
    if (typeof p !== 'number' || typeof p !== 'string') {
        p = null;
    }
    else {
        p = p.toString()
            .replace(/[^\d,.]/g,"")                //"100.240,50zł" -> "100.240,50"
            .replace(/[.,](?!\d+$)|\.$/g,"")       //"100.240,50"   -> "100240,50"
            .split(/[.,]/);                        //"100240,50"    -> ["100240","50"]
        if (!p.every(v => +v >= 0 && +v < 1e12)) { //max bilion (PL) === trillion (EN)
            p = null;
        }
    }
    return p;
};

const setPriceFormat = function (format) {
    /* 
     * 120 zł 50 gr         -> "[zl_value_number] [zl_abbrev] [gr_value_number] [gr_abbrev]"
     * 120 zł 50/100 
     * 120 złotych 50 groszy
     * 120 złotych 50/100
     * 120 złotych 50 gr
     * 120 zł 50 groszy
     * 
     * [zl_value_number] === "120"
     * [gr_value_number] === "50"
     * [zl_value_words] === "sto dwadzieścia"
     * [gr_value_words] === "pięćdziesiąt"
     * [zl_abbrev] === "zł"
     * [gr_abbrev] === "gr"
     * [gr_short] === "50/100"
     * [zl_full] = "złoty" / "złote" / "złotych"
     * [gr_full] = "grosz" / "grosze" / "groszy"
     * 
     * OR predefined style:
     * "A" -> 120 zł 50 gr
     * "B" -> 120 zł 50/100  etc.
     */
    const formatToArray = (str) => str.match(/\[[a-z_]+\]/gi)
                                   .map(v => v.slice(1,-1)
                                   .replace(/(_)([a-z])/gi,(v,$1,$2) => $2.toUpperCase()));
    
    let typeA = "[zl_value_words] [zl_full] [gr_value_words] [gr_full]",
        typeB = "",
        formatArr;
    if (typeof format === 'string') {
        let tmp = formatToArray(format);
        formatArr = (tmp.length) ? tmp : formatToArray(typeA);
    }
    return formatArr;
    //For example: ["zlValueNumber", "zlAbbrev", "grValueNumber", "grAbbrev"]
}

class priceFormatMethods {
    constructon (arr) {
        [this.zl, this.gr] = arr;
    }
    zlValueNumber () {
        return `${this.zl}`;
    }
    zlValueWords () {

    }
    grValueNumber () {
        return (`${this.gr}00`).slice(0,2);
    }
    grValueWords () {

    }
    zlAbbrev () {
        return "zł";
    }
    grAbbrev () {
        return "gr";
    }
    grShort () {
        return `${this.grValueNumber()}/100`;
    }
    zlFull () {
        if (this.zl === 1) { 
            return "złoty"; 
        }
        
        let zl = this.zl.toString().split('').slice(-1);
        if (/[234]/.test(zl)) { 
            return "złote"; 
        }
        else { 
            return "złotych"; 
        }
    }
    grFull () {
        if (this.gr === 1) {
            return "grosz";
        }
        
        let gr = this.gr.toString().split('').slice(-1);
        if (/[234]/.test(gr)) {
            return "grosze";
        }
        else {
            return "groszy";
        }
    }
};

//------------------------------------------------------------------------------
// Export library class
//------------------------------------------------------------------------------
export default class PriceToWords {
    constructor (price) {
        this.priceArray = priceToNumber(price);
    }
    
    getPrice (format) {
        let format = setPriceFormat(format),
            price = new priceFormatMethods(this.priceArray),
            result = "";
        for (let method of format) {
            result += `${price[method]} `;
        }
        return result.trim();
    }
}