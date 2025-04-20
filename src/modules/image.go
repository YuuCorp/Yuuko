package main

import "C"

import (
	"encoding/json"
	"fmt"
)

func main() {}

//export GenerateRecentImage
func GenerateRecentImage(jsonData *C.char) { // pointer to data of type C.char
	goJsonStr := C.GoString(jsonData)

	fmt.Println("TODO: Go function for generating images")
	var userRecents []struct {
		Title    string `json:"title"`
		Status   string `json:"status"`
		ImageURL string `json:"imageUrl"`
	}

	err := json.Unmarshal([]byte(goJsonStr), &userRecents)
	if err != nil {
		fmt.Println("error:", err)
	}
}
