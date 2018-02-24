package main

import (
	"log"
	"net/http"


	"github.com/gorilla/mux"
)

func init() {
	//nothing here
}

func main() {
	r := mux.NewRouter()
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("site")))
	if err := http.ListenAndServe(":3000", r); err != nil {
		log.Fatal(err)
	}
}
