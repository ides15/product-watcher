package scraper

import (
	"fmt"
	"net/http"
	"product-watcher/models"
	"regexp"
	"strconv"
	"time"

	"github.com/PuerkitoBio/goquery"
	"github.com/pkg/errors"
)

type Scraper struct {
	client http.Client
}

func NewScraper() *Scraper {
	client := http.Client{
		Timeout: time.Second * 10,
	}

	return &Scraper{
		client: client,
	}
}

func priceToFloat(priceStr string) (float64, error) {
	// Matches everything except for decimals and periods (a price in float format)
	re := regexp.MustCompile(`[^\d.]`)

	// Removes all the matches
	priceStr = re.ReplaceAllString(priceStr, "")

	price, err := strconv.ParseFloat(priceStr, 64)

	return price, err
}

func (s Scraper) ScrapePrice(URL models.URL) (float64, error) {
	// Get URL HTML
	res, err := s.client.Get(URL.URL)
	if err != nil {
		return 0, errors.Wrap(err, "request to product URL failed")
	}
	defer res.Body.Close()

	if res.StatusCode != 200 {
		return 0, fmt.Errorf("request to product URL return a non-200 code: %d", res.StatusCode)
	}

	// Read HTML body into query selector
	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		return 0, errors.Wrap(err, "unable to load HTML document")
	}

	// Find the first element of the selection
	priceStr := doc.Find(URL.Selector).First().Text()

	if priceStr == "" {
		return 0, fmt.Errorf("unable to parse HTML document with selector '%s': returned \"\"", URL.Selector)
	}

	return priceToFloat(priceStr)
}
