**Zadanie 9**

ChatGPT bot. Należy rozszerzyć funkcjonalność wcześniej stworzonego bota. Do niego
należy stworzyć aplikajcę frontendową, która połączy się z osobnym
serwisem, który przeanalizuje tekst od użytkownika i prześle zapytanie
do GPT, a następnie prześle odpowiedź do użytkownika. Cały projekt
należy stworzyć w Pythonie.

- :white_check_mark: 3.0 należy stworzyć po stronie serwerowej osobny serwis do łącznia z
chatGPT do usługi chat - [Link do commita 1](https://github.com/Blato122/E-Biznes-2024.25/commit/b055e072bf506e66a92de9af8c672b58d69fb45c) 
- :white_check_mark: 3.5 należy stworzyć interfejs frontowy dla użytkownika, który
komunikuje się z serwisem; odpowiedzi powinny być wysyałen do
frontendowego interfejsu - [Link do commita 2](https://github.com/Blato122/E-Biznes-2024.25/commit/9e2724865bfaaec48c0dea154f832e452026e2f4) 
- :white_check_mark: 4.0 stworzyć listę 5 różnych otwarć oraz zamknięć rozmowy - [Link do commita 3](https://github.com/Blato122/E-Biznes-2024.25/commit/18df76dfa5f7558371d9b6bb5b7360bc52fdb335) 
- :white_check_mark: 4.5 filtrowanie po zagadnieniach związanych ze sklepem (np.
ograniczenie się jedynie do ubrań oraz samego sklepu) do GPT - [Link do commita 4](https://github.com/Blato122/E-Biznes-2024.25/commit/ecf8cb605570c984ca403910f8ff0b0252ee5294) 
- :white_check_mark: 5.0 filtrowanie odpowiedzi po sentymencie - [Link do commita 5](https://github.com/Blato122/E-Biznes-2024.25/commit/451ba5bb2c1ce67521ad9a5076bf05804fb01601)

In the ex9 directory:
- run the client: streamlit run client.py
- run the server: uvicorn server:app --reload