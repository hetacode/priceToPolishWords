/**
 * Function is getting rules for price formatting.
 * For invalid rules function return default formatting rules.
 * 
 * @param {String} Rules formatting returned value
 * @return {Array} Array of the formatting methods
 */

const defaultFormats = {
    typeA: 'zl-words zl-full gr-words gr-full', //sto dwadzieścia pięć złotych pięćdziesiąt groszy
    typeB: 'zl-words zl gr-words gr',           //sto dwadzieścia pięć zł pięćdziesiąt gr
    typeC: 'zl-words zl gr-short',              //sto dwadzieścia pięć zł 50/100
    typeD: 'zl-number zl gr-number gr'          //125 zł 50 gr
};

/**
* Function convert rules (e.g. 'zl-words') to valid convertion method names (e.g. 'zlWords')
* 
* @param {String} User formatting rules as string 
* @return {Array} For example: [zlWords, zlFull, ...]
*/
const formatRulesToMethodName = function (str: string) {
    let rulesToArray = str.match(/[-a-z]+/gi); //'zl-words zl' -> ['zl-words', 'zl']
    return rulesToArray?.map(oneRule => {
        return oneRule.replace(/(-)([a-z])/gi, (match, p1, p2) => {
            return p2.toUpperCase(); //'zl-words' -> 'zlWords'
        });
    }); //['zl-words', 'zl'] -> ['zlWords', 'zl']
};

export const setPriceFormat = (formatRules: any) => {
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

    //In first instance set default rules (typeA)
    let formatRulesArray = formatRulesToMethodName(defaultFormats.typeA);

    if (typeof formatRules === 'string') {
        if (formatRules.length === 1) {
            let type = `type${formatRules.toUpperCase()}`;
            if (defaultFormats.hasOwnProperty(type)) {
                formatRulesArray = formatRulesToMethodName((defaultFormats as any)[type]);
            }
        }
        else {
            let tmp = formatRulesToMethodName(formatRules);
            formatRulesArray = (tmp?.length) ? tmp : formatRulesArray;
        }
    }
    else if (typeof formatRules !== 'undefined') {
        formatRulesArray = [''];
    }

    return formatRulesArray; //e.g: ['zlWords', 'zl', 'grWords', 'gr']
};