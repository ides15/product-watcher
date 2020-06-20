package main

import (
	"encoding/json"
	"os"
	"sync"

	"product-watcher/models"
	"product-watcher/scraper"

	log "github.com/sirupsen/logrus"
)

type Config struct {
	Products []models.Product `json:"products"`
}

func main() {
	if os.Getenv("ENV") == "production" {
		log.SetFormatter(&log.JSONFormatter{})
	}

	productsFile, err := os.Open("./products.json")
	if err != nil {
		panic(err)
	}

	config := &Config{}
	err = json.NewDecoder(productsFile).Decode(config)
	if err != nil {
		panic(err)
	}

	s := scraper.NewScraper()

	wg := sync.WaitGroup{}

	for _, p := range config.Products {
		wg.Add(1)

		go func(product models.Product) {
			defer wg.Done()

			if product.Active {
				for _, URL := range product.URLs {
					newPrice, err := s.ScrapePrice(URL)
					if err != nil {
						log.Errorln(URL.Company.Name, product.Name, err)
					} else {
						log.Infoln(URL.Company.Name, product.Name, "new price:", newPrice)
					}
				}
			}
		}(p)
	}

	wg.Wait()
	log.Infoln("Done getting all products")
}
