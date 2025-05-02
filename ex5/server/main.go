package main

import (
	"encoding/json"
	"log"
	"net/http"
)

// sonarcloud suggested fixes:
const (
    contentTypeHeader = "Content-Type"
    jsonContentType   = "application/json"
)

type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
}

type Payment struct {
	CardNumber string `json:"cardNumber"`
	ExpiryDate string `json:"expiryDate"`
	CVV        string `json:"cvv"`
	Name       string `json:"name"`
	Amount     string `json:"amount"`
}

var products = []Product{
	{1, "PC", "High performance GPU", 4999.99},
	{2, "Smartphone", "Latest smartphone model with advanced camera", 899.99},
	{3, "Wardrobe", "A beautiful, old wardrobe", 1999.99},
	{4, "Smartwatch", "Easily track your workouts", 199.99},
	{5, "Desk lamp", "Adjustable LED desk lamp", 49.99},
}

func main() {
	http.HandleFunc("/products", corsMiddleware(handleProducts))
	http.HandleFunc("/payments", corsMiddleware(handlePayments))
	http.HandleFunc("/health", corsMiddleware(handleHealth))

	port := "8080"
	log.Printf("Server starting on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Request received: %s %s from %s", r.Method, r.URL.Path, r.RemoteAddr)

		w.Header().Set("Access-Control-Allow-Origin", "*") // allow any origin
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept")
		w.Header().Set("Access-Control-Max-Age", "3600") // cache preflight for 1 hour

		if r.Method == "OPTIONS" {
			log.Println("Handling preflight request")
			w.WriteHeader(http.StatusOK)
			return
		}

		// process the request
		next(w, r)
	}
}

// handles health check endpoint
func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set(contentTypeHeader, jsonContentType)
	err := json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
    if err != nil {
		log.Printf("Error encoding health status: %v", err)
	}
}

// handles GET requests for products
func handleProducts(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling products request")
	if r.Method != http.MethodGet {
		log.Printf("Method not allowed: %s", r.Method)
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set(contentTypeHeader, jsonContentType)
	log.Printf("Sending product data with %d products", len(products))
	err := json.NewEncoder(w).Encode(products)
	if err != nil {
		log.Printf("Error encoding products: %v", err)
	}
}

// handles POST requests for payments
func handlePayments(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling payments request")
	if r.Method != http.MethodPost {
		log.Printf("Method not allowed: %s", r.Method)
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payment Payment
	err := json.NewDecoder(r.Body).Decode(&payment)
	if err != nil {
		log.Printf("Error decoding payment: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Printf("Payment received: %+v", payment)

	// success response
	w.Header().Set(contentTypeHeader, jsonContentType)
	w.WriteHeader(http.StatusOK)
	err = json.NewEncoder(w).Encode(map[string]string{"status": "success"})
	if err != nil {
		log.Printf("Error encoding health status: %v", err)
	}
}
