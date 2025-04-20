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
func GenerateRecentImage(jsonData *C.char, fixedSize C.int) *C.char { // pointer to data of type C.char
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

	goFixedSize := int(fixedSize)
	buf := new(bytes.Buffer)
	buf.Grow(int(goFixedSize))
	err = png.Encode(buf, recentImage)
	if err != nil {
		fmt.Println("error encoding image:", err)
	}

	imgBytes := buf.Bytes()

	fmt.Printf("Size is %d", len(imgBytes))

	// pad the array until it fills fixed size
	if len(imgBytes) < goFixedSize {
		padding := make([]byte, goFixedSize-len(imgBytes))
		imgBytes = append(imgBytes, padding...)
	}

	cBuf := C.CBytes(imgBytes)

	return (*C.char)(cBuf)
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
