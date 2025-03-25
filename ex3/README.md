**Zadanie 3**

- [x] 3.0 Należy stworzyć aplikację kliencką w Kotlinie we frameworku Ktor,
która pozwala na przesyłanie wiadomości na platformę Discord

- [x] 3.5 Aplikacja jest w stanie odbierać wiadomości użytkowników z
platformy Discord skierowane do aplikacji (bota)

- [x] 4.0 Zwróci listę kategorii na określone żądanie użytkownika

- [x] 4.5 Zwróci listę produktów wg żądanej kategorii

- [ ] 5.0 Aplikacja obsłuży dodatkowo jedną z platform: Slack, Messenger,
Webex

**link: https://hub.docker.com/r/blato122/ex3**

**How to run the Discord bot:**
- Pull the Docker image: docker pull blato122/ex3
- A Discord bot token
- A Discord channel ID where the bot will operate
- Create an .env file as such:
    - DISCORD_TOKEN=your_token_here
    - DISCORD_CHANNEL=your_channel_id_here
- Run using docker compose: docker compose up --build
- Once the bot is running, you can use these commands in Discord:
    - !categories - Shows all available product categories
    - !excursion - Shows all products in the "excursion" category
    - !clothes - Shows all products in the "clothes" category
    - !equipment - Shows all products in the "equipment" category

**Create a Discord bot in the [Discord Developer Portal](https://discord.com/developers/applications):**
   - Create a new application
   - Go to the "Bot" tab and create a bot
   - Copy the bot token
   - Under "OAuth2 > URL Generator", select "bot" scope and "Send Messages" permission
        - URI from "Redirects" worked as well: use channel ID as client_id
   - Use the generated URL to invite the bot to your server

**Get your Discord channel ID:**
   - Enable developer mode in Discord (user settings -> advanced -> developer mode)
   - Right-click on a channel and select "Copy ID"