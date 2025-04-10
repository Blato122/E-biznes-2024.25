package main

import (
	"encoding/json"
	"log"
	"net/http"
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
	http.HandleFunc("/products", handleProducts)
	http.HandleFunc("/payments", handlePayments)

	handler := enableCORS(http.DefaultServeMux)

	log.Println("Server starting on :8080...")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func enableCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		h.ServeHTTP(w, r)
	})
}

func handleProducts(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func handlePayments(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payment Payment
	err := json.NewDecoder(r.Body).Decode(&payment)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Printf("Payment received: %+v\n", payment)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}
