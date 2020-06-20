package models

type URL struct {
	ID       int      `json:"id"`
	URL      string   `json:"url"`
	Selector string   `json:"selector"`
	Company  *Company `json:"company"`
}
