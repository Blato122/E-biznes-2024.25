**Zadanie 1**

- :white_check_mark: 3.0 obraz ubuntu z Pythonem w wersji 3.10

- :white_check_mark: 3.5 obraz ubuntu:24.02 z Javą w wersji 8 oraz Kotlinem

- :white_check_mark: 4.0 do powyższego należy dodać najnowszego Gradle’a oraz paczkę JDBC
SQLite w ramach projektu na Gradle (build.gradle)

- :white_check_mark: 4.5 stworzyć przykład typu HelloWorld oraz uruchomienie aplikacji
przez CMD oraz gradle

- :white_check_mark: 5.0 dodać konfigurację docker-compose

Obraz należy wysłać na hub.docker.com, a link do obrazu należy dodać w
README na githubie.

**Link: https://hub.docker.com/r/blato122/ex1**

Kod: ex1

Zadanie zrobione przed otrzymaniem szablonu z wytycznymi.

**Zadanie 2**

Należy stworzyć aplikację na frameworku Play w Scali 3.

- :white_check_mark: 3.0 Należy stworzyć kontroler do Produktów

- :white_check_mark: 3.5 Do kontrolera należy stworzyć endpointy zgodnie z CRUD - dane
pobierane z listy

- :white_check_mark: 4.0 Należy stworzyć kontrolery do Kategorii oraz Koszyka + endpointy
zgodnie z CRUD

- :white_check_mark: 4.5 Należy aplikację uruchomić na dockerze (stworzyć obraz) oraz dodać
skrypt uruchamiający aplikację via ngrok

- :white_check_mark: 5.0 Należy dodać konfigurację CORS dla dwóch hostów dla metod CRUD

Kontrolery mogą bazować na listach zamiast baz danych. CRUD: show all,
show by id (get), update (put), delete (delete), add (post).

**Link: https://hub.docker.com/r/blato122/ex2**

Kod: ex2

Zadanie zrobione przed otrzymaniem szablonu z wytycznymi.

**Zadanie 3**

- :white_check_mark: 3.0 Należy stworzyć aplikację kliencką w Kotlinie we frameworku Ktor,
która pozwala na przesyłanie wiadomości na platformę Discord

- :white_check_mark: 3.5 Aplikacja jest w stanie odbierać wiadomości użytkowników z
platformy Discord skierowane do aplikacji (bota)

- :white_check_mark: 4.0 Zwróci listę kategorii na określone żądanie użytkownika

- :white_check_mark: 4.5 Zwróci listę produktów wg żądanej kategorii

- :x: 5.0 Aplikacja obsłuży dodatkowo jedną z platform: Slack, Messenger,
Webex

**link: https://hub.docker.com/r/blato122/ex3**

Kod: ex3

Zadanie zrobione przed otrzymaniem szablonu z wytycznymi.

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
- :white_check_mark: 4.0 Należy dodać model Koszyka oraz dodać odpowiedni endpoint - [Link do commita 3](https://github.com/Blato122/E-Biznes-2024.25/commit/f77a44b9e445758d4dbc97696b4d65541215e085)
- :white_check_mark: 4.5 Należy stworzyć model kategorii i dodać relację między kategorią,
a produktem - [Link do commita 4](https://github.com/Blato122/E-Biznes-2024.25/commit/4b7440142a7d78346696a915632ff70138cb3d3c)
- :white_check_mark: 5.0 pogrupować zapytania w gorm’owe scope'y - [Link do commita 5](https://github.com/Blato122/E-Biznes-2024.25/commit/4f389fcdb21fef1f00e2b37e1c1d33f51b4c81aa)

Kod: ex4

**Zadanie 5**

Należy stworzyć aplikację kliencką wykorzystując bibliotekę React.js.
W ramach projektu należy stworzyć trzy komponenty: Produkty, Koszyk
oraz Płatności. Koszyk oraz Płatności powinny wysyłać do aplikacji
serwerowej dane, a w Produktach powinniśmy pobierać dane o produktach
z aplikacji serwerowej. Aplikacja serwera w jednym z trzech języków:
Kotlin, Scala, Go. Dane pomiędzy wszystkimi komponentami powinny być
przesyłane za pomocą React hooks.

- :white_check_mark: 3.0 W ramach projektu należy stworzyć dwa komponenty: Produkty oraz
Płatności; Płatności powinny wysyłać do aplikacji serwerowej dane, a w
Produktach powinniśmy pobierać dane o produktach z aplikacji
serwerowej; - [Link do commita 1](https://github.com/Blato122/E-Biznes-2024.25/commit/cb26a55c75062c61c2b79550d636765014040a68)
- :white_check_mark: 3.5 Należy dodać Koszyk wraz z widokiem; należy wykorzystać routing - [Link do commita 2](https://github.com/Blato122/E-Biznes-2024.25/commit/72050ecb5923a044924dc7e50e7da035692bae26)
- :white_check_mark: 4.0 Dane pomiędzy wszystkimi komponentami powinny być przesyłane za
pomocą React hooks - [Link do commita 3](https://github.com/Blato122/E-Biznes-2024.25/commit/4c13670e2ddfc7465831f250d0e06120d6683eb8)
- :white_check_mark: 4.5 Należy dodać skrypt uruchamiający aplikację serwerową oraz
kliencką na dockerze via docker-compose - [Link do commita 4](https://github.com/Blato122/E-Biznes-2024.25/commit/eb50928c76e556481754d37145f39f528d2f2e9f)
- :white_check_mark: 5.0 Należy wykorzystać axios’a oraz dodać nagłówki pod CORS - [Link do commita 5](https://github.com/Blato122/E-Biznes-2024.25/commit/0a61085b5bf7d64bbfd25f89d4e9eab25327b4a8)

Kod: ex5

**Zadanie 6** 

Testy. Należy stworzyć 20 przypadków testowych w jednym z rozwiązań:

- Cypress JS (JS)
- Selenium (Kotlin, Python, Java, JS, Go, Scala)

Testy mają w sumie zawierać minimum 50 asercji (3.5). Mają również
uruchamiać się na platformie Browserstack (5.0). Proszę pamiętać o
stworzeniu darmowego konta via https://education.github.com/pack.

- :white_check_mark: 3.0 Należy stworzyć 20 przypadków testowych w CypressJS lub Selenium
(Kotlin, Python, Java, JS, Go, Scala) - [Link do commita 1](https://github.com/Blato122/E-Biznes-2024.25/commit/61a2b6326fbd7afd4a76803df70188610972c1ca)
- :white_check_mark: 3.5 Należy rozszerzyć testy funkcjonalne, aby zawierały minimum 50
asercji - [Link do commita 2](https://github.com/Blato122/E-Biznes-2024.25/commit/61a2b6326fbd7afd4a76803df70188610972c1ca) 
- :white_check_mark: 4.0 Należy stworzyć testy jednostkowe do wybranego wcześniejszego
projektu z minimum 50 asercjami - [Link do commita 3](https://github.com/Blato122/E-Biznes-2024.25/commit/e6b3ec6a21aa13babaca6f1b3c3709b3535c472a) 
- :white_check_mark: 4.5 Należy dodać testy API, należy pokryć wszystkie endpointy z
minimum jednym scenariuszem negatywnym per endpoint - [Link do commita 4](https://github.com/Blato122/E-Biznes-2024.25/commit/) 
- :grey_question: 5.0 Należy uruchomić testy funkcjonalne na Browserstacku - [Link do commita 5](https://github.com/Blato122/E-Biznes-2024.25/commit/167a0ee5cb2bd36a9558aeb6f91b6c76e706a5fa) 

4.0 - [link do testów jednostkowych]()
4.5 - [link do testów endpointów]()
5.0 - [link do Browserstacka](https://automate.browserstack.com/dashboard/v2/builds/c5808e2d2a2750bc620dadabf7a327f7cf85068b) - a lot of timeouts (?)

kod: ex6