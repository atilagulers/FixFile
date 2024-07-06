package main

import (
	"context"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) GetPath() (string, error) {
	folder, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select a Folder",
	})
	if err != nil {
		return "", err
	}
	return folder, nil
}

func (a *App) OrganizeDir(targetPath, outputPath string) error {
	fmt.Println("Reading folder: ", targetPath)
	fmt.Println("Output folder: ", outputPath)
	var files []fs.DirEntry
	err := walkDir(&files, targetPath)

	if err != nil {
		return err
	}

	lastOutputDir := filepath.Base(outputPath)
	err = os.Mkdir("./test"+"_organized", 0750)
	if err != nil && !os.IsExist(err) {
		log.Fatal(err)
	}
	return nil
}

func walkDir(files *[]fs.DirEntry, dirPath string) error {

	err := filepath.WalkDir(dirPath, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() {
			fmt.Println(filepath.Ext(d.Name()))
			*files = append(*files, d)

		}
		return nil
	})

	if err != nil {
		return err
	}

	return nil
}
