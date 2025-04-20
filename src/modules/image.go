package main

import "C"

import (
	"bytes"
	_ "embed"
	"encoding/json"
	"fmt"
	"image"
	"image/color"
	_ "image/jpeg" // to add support for JPEG images
	"image/png"
	"net/http"
	"strings"

	"golang.org/x/image/draw"
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
		res, err := http.Get(userRecents[i].ImageURL)
		if err != nil || res.StatusCode != 200 {
			fmt.Println("error:", err)
			continue
		}
		defer res.Body.Close()

		contentType := res.Header.Get("Content-Type")
		if !strings.HasPrefix(contentType, "image/") {
			fmt.Println("Error: Content is not an image, but", contentType)
			continue
		}

		cover, _, err := image.Decode(res.Body)
		if err != nil {
			fmt.Println("error:", err)
			continue
		}

		coverWidth := cover.Bounds().Dx()
		coverHeight := cover.Bounds().Dy()

		scale := float64(size) / float64(coverWidth)
		scaledWidth := size
		scaledHeight := int(float64(coverHeight) * scale)

		// Create a scaled version of the image
		scaledImg := image.NewRGBA(image.Rect(0, 0, scaledWidth, scaledHeight))
		draw.CatmullRom.Scale(scaledImg, scaledImg.Bounds(), cover, cover.Bounds(), draw.Over, nil)

		// Now create a 300x300 canvas and center the image vertically
		dst := image.NewRGBA(image.Rect(0, 0, size, size))
		draw.Draw(dst, dst.Bounds(), &image.Uniform{color.White}, image.Point{}, draw.Src)

		offsetY := (size - scaledHeight) / 2
		draw.Draw(dst, image.Rect(0, offsetY, size, offsetY+scaledHeight), scaledImg, image.Point{}, draw.Over)

		drawText(face, dst, userRecents[i].Title, size)
		draw.Draw(recentImage, image.Rect(x, y, x+size, y+size), dst, image.Point{}, draw.Over)

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

func drawText(typeFace font.Face, baseImage *image.RGBA, text string, size int) {
	drawer := &font.Drawer{
		Dst:  baseImage,
		Src:  image.NewUniform(color.White),
		Face: typeFace,
		Dot: fixed.Point26_6{
			X: fixed.I(0),
			Y: fixed.I(size),
		},
	}

	bounds, _ := drawer.BoundString(text)
	textWidth := (bounds.Max.X - bounds.Min.X).Round()
	textHeight := (bounds.Max.Y - bounds.Min.Y).Round()

	boundsCenter := textWidth / 2

	xPosition := size/2 - boundsCenter
	yPosition := drawer.Dot.Y.Round() - textHeight - 5

	drawer.Dot = fixed.Point26_6{
		X: fixed.I(xPosition),
		Y: fixed.I(yPosition),
	}

	semiTransparentBlack := color.RGBA{0, 0, 0, 192}
	textBackdrop := image.Rect(xPosition-10, yPosition-textHeight-10, xPosition+textWidth+5, yPosition+15)
	draw.Draw(baseImage, textBackdrop, &image.Uniform{semiTransparentBlack}, image.Point{}, draw.Over)

	drawer.DrawString(text)
}
