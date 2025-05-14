**Zadanie 8**

Oauth2. Należy skonfigurować klienta Oauth2 (4.0). Dane o użytkowniku wraz z
tokenem powinny być przechowywane po stronie bazy serwera, a nowy
token (inny niż ten od dostawcy) powinien zostać wysłany do klienta
(React). Można zastosować mechanizm sesji lub inny dowolny (5.0).
Zabronione jest tworzenie klientów bezpośrednio po stronie React'a
wyłączając z komunikacji aplikację serwerową, np. wykorzystując auth0.

Prawidłowa komunikacja: react-sewer-dostawca-serwer(via return
uri)-react.

- :white_check_mark: 3.0 logowanie przez aplikację serwerową (bez Oauth2) - [Link do commita 1](https://github.com/Blato122/E-Biznes-2024.25/commit/60ddcfcc6d6b60ee3ca9a62811e58fe4c70032ee)
- :white_check_mark: 3.5 rejestracja przez aplikację serwerową (bez Oauth2) - [Link do commita 2](https://github.com/Blato122/E-Biznes-2024.25/commit/80ea28474c2ae67f09919c70dc2768660b150f5f)
- :white_check_mark: 4.0 logowanie via Google OAuth2 - [Link do commita 3](https://github.com/Blato122/E-Biznes-2024.25/commit/f9874887f378fba11dda9e4d34daf740473e4ce9)
- :white_check_mark: 4.5 logowanie via Facebook lub Github OAuth2 - [Link do commita 4](https://github.com/Blato122/E-Biznes-2024.25/commit/f68df8f76d425fb55a2c8479d7d4df21fddcc4c4)
- :white_check_mark: 5.0 zapisywanie danych logowania OAuth2 po stronie serwera - [Link do commita 5](https://github.com/Blato122/E-Biznes-2024.25/commit/cbef8daeea16cdf92a206229136368ce208159fd)
