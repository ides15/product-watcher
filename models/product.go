package models

import "time"

type Product struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Active  bool   `json:"active"`
	URLs    []URL  `json:"urls"`
	History []struct {
		ID    int       `json:"id"`
		Date  time.Time `json:"date"`
		Price float64   `json:"price"`
	} `json:"history"`
}
