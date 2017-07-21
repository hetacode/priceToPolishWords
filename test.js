const assert = require('chai').assert;
const PriceToPolishWords = require('./priceToPolishWords');

describe('Test of price: 125,50', () => {
    const price = new PriceToPolishWords('125,50');
    it('Test of default price format', () => {
        assert.equal(price.getPrice(), 'sto dwadzieścia pięć złotych pięćdziesiąt groszy');
        assert.equal(price.getPrice(undefined), 'sto dwadzieścia pięć złotych pięćdziesiąt groszy');
    });
    it('Test for basic formats', () => {
        assert.equal(price.getPrice('zl-number'), '125');
        assert.equal(price.getPrice('gr-number'), '50');
        assert.equal(price.getPrice('zl-words'), 'sto dwadzieścia pięć');
        assert.equal(price.getPrice('gr-words'), 'pięćdziesiąt');
        assert.equal(price.getPrice('zl'), 'zł');
        assert.equal(price.getPrice('gr'), 'gr');
        assert.equal(price.getPrice('gr-short'), '50/100');
        assert.equal(price.getPrice('zl-full'), 'złotych');
        assert.equal(price.getPrice('gr-full'), 'groszy');
    });
    it('Test of predefined price formats', () => {
        assert.equal(price.getPrice('a'), 'sto dwadzieścia pięć złotych pięćdziesiąt groszy');
        assert.equal(price.getPrice('A'), 'sto dwadzieścia pięć złotych pięćdziesiąt groszy');
        assert.equal(price.getPrice('b'), 'sto dwadzieścia pięć zł pięćdziesiąt gr');
        assert.equal(price.getPrice('c'), 'sto dwadzieścia pięć zł 50/100');
        assert.equal(price.getPrice('d'), '125 zł 50 gr');
    });
    it('Test of valid user defined formats', () => {
        assert.equal(price.getPrice('zl-words zl-full'), 'sto dwadzieścia pięć złotych');
        assert.equal(price.getPrice('gr-words gr-full'), 'pięćdziesiąt groszy');
        assert.equal(price.getPrice('zl-words zl gr-words gr'), 'sto dwadzieścia pięć zł pięćdziesiąt gr');
    });
    it('Test of invalid user defined formats', () => {
        assert.equal(price.getPrice('zl-words xxx zl-full'), 'Invalid format!');
        assert.equal(price.getPrice('xxx'), 'Invalid format!');
        assert.equal(price.getPrice(555), 'Invalid format!');
        assert.equal(price.getPrice([]), 'Invalid format!');
        assert.equal(price.getPrice(['xxx']), 'Invalid format!');
        assert.equal(price.getPrice({rule: 'xxx'}), 'Invalid format!');
    });
});

describe('Test for round "grosze"', () => {
    const format = 'zl-words zl gr-words gr';
    
    it('Zlote and grosze',  () => {
        assert.equal((new PriceToPolishWords('5,00')).getPrice(format), 'pięć zł zero gr');
        assert.equal((new PriceToPolishWords('5,05')).getPrice(format), 'pięć zł pięć gr');
        assert.equal((new PriceToPolishWords('5,051')).getPrice(format), 'pięć zł pięć gr');
        assert.equal((new PriceToPolishWords('5,055')).getPrice(format), 'pięć zł sześć gr');
        assert.equal((new PriceToPolishWords('5,001')).getPrice(format), 'pięć zł zero gr');
        assert.equal((new PriceToPolishWords('5,005')).getPrice(format), 'pięć zł jeden gr');
        assert.equal((new PriceToPolishWords('5,25')).getPrice(format), 'pięć zł dwadzieścia pięć gr');
        assert.equal((new PriceToPolishWords('5,252')).getPrice(format), 'pięć zł dwadzieścia pięć gr');
        assert.equal((new PriceToPolishWords('5,255')).getPrice(format), 'pięć zł dwadzieścia sześć gr');
    });
    it('Only "grosze"', () => {
        assert.equal((new PriceToPolishWords('0,05')).getPrice(format), 'zero zł pięć gr');
        assert.equal((new PriceToPolishWords(',05')).getPrice(format), 'zero zł pięć gr');
    });
});

describe('Test of max alowed pruice', () => {
    const format = 'zl-words zl gr-words gr';
    const d = 'dziewięćset dziewięćdziesiąt dziewięć';
    const expected = `${d} miliardów ${d} milionów ${d} tysięcy ${d} zł dziewięćdziesiąt dziewięć gr`;
    
    it('Test of 999 999 999 999,99zł', () => {
        assert.equal((new PriceToPolishWords('999 999 999 999,99')).getPrice(format), expected);
        assert.equal((new PriceToPolishWords('999,999,999,999.99')).getPrice(format), expected);
        assert.equal((new PriceToPolishWords('999999999999,99')).getPrice(format), expected);
        assert.equal((new PriceToPolishWords('999999999999.99')).getPrice(format), expected);
    });
});

describe('Test of invalid price and error message', () => {
    //default error message: Błędna kwota!
    it('Test for default error message', () => {
        assert.equal((new PriceToPolishWords('xxx')).getPrice(), 'Błędna kwota!');
    });
    it('Test for user error message getting as string', () => {
        assert.equal((new PriceToPolishWords('xxx', 'user message')).getPrice(), 'user message');
    });
    it('Test for invalid user error message - not string', () => {
        assert.equal((new PriceToPolishWords('xxx', 55)).getPrice(), 'Błędna kwota!');
        assert.equal((new PriceToPolishWords('xxx', [])).getPrice(), 'Błędna kwota!');
        assert.equal((new PriceToPolishWords('xxx', {})).getPrice(), 'Błędna kwota!');
    });
});