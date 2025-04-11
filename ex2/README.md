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

**Pull the latest image from Docker Hub:**
* Pull the latest image from Docker Hub: docker pull blato122/ex2
* Run the container: docker run -d -p 9000:9000 --name ex2 blato122/ex2
* Test the endpoints at http://localhost:9000/ENDPOINT (or curl http://localhost:9000/ENDPOINT)

**Run with ngrok using docker compose:** 
* An ngrok token in the .env file is required!
* Start the services docker compose up -d
* Access the ngrok admin interface at http://localhost:4040 to find your public URL
* Access the API through the ngrok URL: https://XYZ.ngrok-free.app/ENDPOINT

**Run with ngrok using bash script:** 
* An ngrok token in the .env file is required!
* Make the script executable: chmod +x ngrok-script.sh
* Run the script: ./ngrok-script.sh
* Access the ngrok admin interface at http://localhost:4040 to find your public URL
* Access the API through the ngrok URL: https://XYZ.ngrok-free.app/ENDPOINT