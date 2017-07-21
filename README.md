# Konwertowanie kwoty liczbowej do postaci słownej

Skrypt umożliwiający przedstawienie kwot w postaci słownej (w języku polskim). Funkcja pobiera kwotę jako wartość liczbową lub ciąg znakowy i zwraca jej podstać słowną zgodną ze wskazanym formatem wyświetlania (lub wg formatu domyślnego).

### Instalacja
Aby pobrać moduł npm należy użyć komendy:
```
npm install --save-dev price-to-polish-words
```

### Sposób użycia
Na początku należy stworzyć nowy obiekt PriceToWords, przekazując do konstruktora kwotę, którą chcemy przekonwertować do postaci słownej lub sformatować wg ustaonych zasad.
```
const PriceToPolishWords = require('price-to-polish-words');

const a = new PriceToPolishWords(120.50);
const b = new PriceToPolishWords("120.50");
const c = new PriceToPolishWords("120");
const d = new PriceToPolishWords(120);
const e = new PriceToPolishWords("120,540.50");
```
Wartość przekazana jako argument dla konstruktora PriceToWords musi być wartością, która będzie mogła zostać poprawnie przekonwertowana do kwoty liczbowej. Konwertowaie odbywa się przy użyciu wyrażeń regularnych, które dopuszczają podawanie kwot z użyciem separatorów tysięcznych w formie kropki lub przecinka, przy czym ostatni separator traktowany jest jako separacja groszy.

Konstruktor przyjmuje również drugi, opcjonalny argument, którym jest komunikat błędu, zwracany w przypadku podania jako kwoty wartośi, której nie da się w prawidłowy sposób przekonwertować na wartość liczbową.
```
const priceUser = new PriceToPolishWords('xxx', 'Ups, błędna kwota!');
const priceDefault = new PriceToPolishWords('xxx');

priceUser.getPrice();    //'Ups, błędna kwota!'
priceDefault.getPrice(); //'Błędna kwota!'
```
W przypadku braku druiego argumentu w razie wystąpienia błędu zwrócony zostanie komunikat domyślny, czyli "Błędna kwota!".


Kolejnym etapem jest wywołanie metody getPrice, która pobiera jeden, opcjonalny argument wskazujący na format konwertowania kwoty:
```
const price = new PriceToPolishWords("12,50");

price.getPrice(); 
//dwanaście złotych pięćdziesiąt groszy

price.getPrice('c');
//dwanaście zł 50/100
```
Format konwertowania musi zostać przekazany jako wartość typu string w formie formatu prefediniowanego lub formatu użytkownika.

### Formaty konwertowania stosowane w metodzie getPrice
W przypadku pominięcia parametru w wywołaniu metody getPrice użyty zostanie forma domyślny. Funkcja umożliwia określenie własnego formatu na podstawie dostępnych elementów składowych lub określenie jednego z formatów predefiniowanych.

***Sposób podania formatu konwersji dla metody getPrice:***
```
price.getPrice('b'); 
//w przypadku formaty predefiniowanego

price.getPrice('zl-words zl');
//w przypadku określania własnych reguł konwersji
```
Własne reguły podaje się z jako ciąg znakowy, zawierający poszczególne elementy oddzielone spacją. W przypadku podania błędnego stylu formatowania zwrócony zostanie komunikat "Invalid format!".

***Dopuszczalne elementy:***
Kwota testowa: 125,50
```
zl-number === "125"
gr-number === "50"
zl-words === "sto dwadzieścia pięć"
gr-words === "pięćdziesiąt"
zl === "zł"
gr === "gr"
gr-short === "50/100"
zl-full === "złoty" || "złote"  || "złotych"
gr-full === "grosz" || "grosze" || "groszy"
```

***Formaty predefniowane:***
Formaty można podawać w zapisie "a" lub "A".
```
typeA: 'zl-words zl-full gr-words gr-full', //sto dwadzieścia pięć złotych pięćdziesiąt groszy
typeB: 'zl-words zl gr-words gr',           //sto dwadzieścia pięć zł pięćdziesiąt gr
typeC: 'zl-words zl gr-short',              //sto dwadzieścia pięć zł 50/100
typeD: 'zl-number zl gr-number gr'          //125 zł 50 gr
```

***Funkcja pozwala na konwertowanie kwot od zera zł do 999,999,999,999.99***