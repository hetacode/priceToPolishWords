# Konwertowanie kwoty liczbowej do postaci słownej

Skrypt umożliwiający przestawienie kwot w postaci słownej w języku polskim. Funkcja pobiera kwotę jako wartość liczbową lub ciąg znakowy i zwraca jej podstać słowną zgodną ze wskazanym formatem wyświetlania (lub wg formatu domyślnego).

### Sposób użycia funkcji priceToWords
Na początku należy stworzyć nowy obiekt PriceToWords, przekazując do konstruktora kwotę, którą chcemy przekonwertować do postaci słownej lub sformatować wg ustaonych zasad.
```
let a = new PriceToWords(120.50);
    b = new PriceToWords("120.50");
    c = new PriceToWords("120.50zł");
    d = new PriceToWords("120zł");
    e = new PriceToWords("120.540,79zł");
```
Wartość przekazana jako argument dla konstruktora PriceToWords musi być wartością, która będzie mogła zostać poprawnie przekonwertowana do kwoty liczbowej (konwertowaie odbywa się przy użyciu wyrażeń regularnych, które dopuszczają podawanie kwot z końcówkami "zł", "gr" oraz kwot z użyciem separatorów tysięcznych w formie kropki lub przecinka, przy czym ostatni separator zakłada się, że określa liczbę groszy.

Kolejnym etapem jest wywołanie metody getPrice, która pobiera jeden, opcjonalny argument wskazujący na format konwertowania kwoty:
```
let price = new PriceToWords("12,50zł");

price.getPrice(); 
//dwanaście złotych pięćdziesiąt groszy

price.getPrice('c');
//dwanaście zł 50/100
```

### Formaty konwertowania stosowane w metodzie getPrice
W przypadku pominięcia parametru w wywołaniu metody getPrice użyty zostanie forma domyślny. Funkcja umożliwia określenie własnego formatu na podstawie dostępnych elementów składowych lub określenie jednego z formatów predefiniowanych.

*** Sposób podania formatu konwersji dla metody getPrice:
```
price.getPrice('b'); 
//w przypadku formaty predefiniowanego

price.getPrice('[zl_value_words] [zl_abbrev]');
//w przypadku określania własnych reguł konwersji
```
Własne reguły podaje się z jako ciąg znakowy, zawierający poszczególne elementy zapisywane w nawiasach kwadratowych w notacji z podkreśleniami dolnymi. Wszystkie znaki nie będące poprawnym elementem formatowania [...] zostaną zignorowane.

*** Dopuszczalne elementy:
Kwota testowa: 120,50zł
```
[zl_value_number]   === "120"
[gr_value_number]   === "50"
[full_value_number] === "120,50"

[zl_value_words] === "sto dwadzieścia"
[gr_value_words] === "pięćdziesiąt"

[zl_abbrev] === "zł"
[gr_abbrev] === "gr"
[gr_short]  === "50/100"
[zl_full] === "złoty" / "złote" / "złotych"
[gr_full] === "grosz" / "grosze" / "groszy"
```

*** Formaty predefniowane:
Formaty można podawać w zapisie "a" lub "A".
```
'A' === '[zl_value_words] [zl_full] [gr_value_words] [gr_full]'
        //sto dwadzieścia pięć złotych pięćdziesiąt groszy

'B' === '[zl_value_words] [zl_abbrev] [gr_value_words] [gr_abrev]'
        //sto dwadzieścia pięć zł pięćdziesiąt gr
        
'C' === '[zl_value_words] [zl_abbrev] [gr_short]'
        //sto dwadzieścia pięć zł 50/100

'D' === '[zl_value_number] [zl_abbrev] [gr_value_number] [gr_abbrev]'
        //120 zł 50 gr

'E' === '[full_value_number] [zl_abbrev]'
        //120,50 zł
```

W przypadku podania błędnej kwoty przy tworzeniu obiektu PriceToWords zwrócona zostanie wartość "Podana kwota jest nieprawidłowa!".

*** Funkcja pozwala na konwertowanie kwot od zera zł do 999.999.999.999,99 (jeden trylion - 0,01).