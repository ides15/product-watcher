package main

import (
	"fmt"
	"log"

	"github.com/ides15/product-watcher/api/services"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	s3, err := services.NewS3Client()
	if err != nil {
		log.Fatal(err)
	}

	// // List objects in bucket
	// objects, err := s3.ListObjects()
	// if err != nil {
	// 	log.Fatal(err)
	// }

	// for _, obj := range objects {
	// 	log.Println(obj)
	// }

	// Get single product
	product, err := s3.GetProduct("LG OLED C9 65")
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(product.Name)
	fmt.Println(product.URLs)
	fmt.Println()

	for _, history := range product.History {
		fmt.Println(history.Date)
		fmt.Println(history.Price)
		fmt.Println(history.URL)
		fmt.Println()
	}
}
