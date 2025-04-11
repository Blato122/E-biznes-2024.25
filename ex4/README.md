**Zadanie 4**

Należy stworzyć projekt w echo w Go. Należy wykorzystać gorm do
stworzenia 5 modeli, gdzie pomiędzy dwoma musi być relacja. Należy
zaimplementować proste endpointy do dodawania oraz wyświetlania danych
za pomocą modeli. Jako bazę danych można wybrać dowolną, sugerowałbym
jednak pozostać przy sqlite.

- :white_check_mark: 3.0 Należy stworzyć aplikację we frameworki echo w j. Go, która będzie
miała kontroler Produktów zgodny z CRUD - [Link do commita 1](https://github.com/Blato122/E-Biznes-2024.25/commit/2b4ef841e72ec8af159ed649a1778f185b672798)
- :white_check_mark: 3.5 Należy stworzyć model Produktów wykorzystując gorm oraz
wykorzystać model do obsługi produktów (CRUD) w kontrolerze (zamiast
listy) - [Link do commita 2](https://github.com/Blato122/E-Biznes-2024.25/commit/45c2118416dd3da02bd4834e3db465a1ceab4b54)
- :x: 4.0 Należy dodać model Koszyka oraz dodać odpowiedni endpoint
- :x: 4.5 Należy stworzyć model kategorii i dodać relację między kategorią,
a produktem
- :x: 5.0 pogrupować zapytania w gorm’owe scope'y

Kod: ex4