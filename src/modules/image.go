package main

import "C"

import (
	"bytes"
	_ "embed"
	"encoding/json"
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/png"

	"golang.org/x/image/font"
	"golang.org/x/image/font/opentype"
	"golang.org/x/image/math/fixed"
)

func main() {}

//go:embed assets/OpenSans-Regular.ttf
var fontBytes []byte

//export GenerateRecentImage
func GenerateRecentImage(jsonData *C.char) *C.char { // pointer to data of type C.char
	goJsonStr := C.GoString(jsonData)

	var userRecents []struct {
		Title    string `json:"title"`
		Status   string `json:"status"`
		ImageURL string `json:"imageUrl"`
	}

	err := json.Unmarshal([]byte(goJsonStr), &userRecents)
	if err != nil {
		fmt.Println("error:", err)
	}

	ttf, err := opentype.Parse(fontBytes)
	if err != nil {
		fmt.Println("error:", err)
	}

	face, err := opentype.NewFace(ttf, &opentype.FaceOptions{
		Size:    16,
		DPI:     72,
		Hinting: font.HintingFull,
	})
	if err != nil {
		fmt.Println("error:", err)
	}

	recentImage := image.NewRGBA(image.Rect(0, 0, 900, 900))
	draw.Draw(recentImage, recentImage.Bounds(), &image.Uniform{C: color.White}, image.Point{}, draw.Src)

	x := 0
	y := 0
	size := 300
	for i := range userRecents {
		drawText(face, recentImage, userRecents[i].Title, image.Point{x + 150, y + 250})

		x += size
		if x >= 900 {
			x = 0
			y += size
		}
	}

	var buf bytes.Buffer
	err = png.Encode(&buf, recentImage)
	if err != nil {
		fmt.Println("error encoding image:", err)
	}

	imgBytes := buf.Bytes()

	// because we can't return the pointer to the image & the size in one value
	// we'll add the size into the buffer, and then in TypeScript remove it
	sizeBytes := []byte{
		byte(len(imgBytes) >> 24),
		byte(len(imgBytes) >> 16),
		byte(len(imgBytes) >> 8),
		byte(len(imgBytes)),
	}

	fmt.Printf("Size is %d", len(imgBytes))

	fullBuffer := C.CBytes(append(sizeBytes, imgBytes...))

	return (*C.char)(fullBuffer)
}

func drawText(typeFace font.Face, baseImage *image.RGBA, text string, point image.Point) {
	drawer := &font.Drawer{
		Dst:  baseImage,
		Src:  image.NewUniform(color.Black),
		Face: typeFace,
		Dot: fixed.Point26_6{
			X: fixed.I(point.X),
			Y: fixed.I(point.Y),
		},
	}

	drawer.DrawString(text)
}
