package main

import (
	"context"
	"fmt"
	"os"

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

func (a *App) SelectFolder() (string, error) {
	folder, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select a Folder",
	})
	if err != nil {
		return "", err
	}
	fmt.Println("Selected Folder: ", folder)
	return folder, nil
}

func (a *App) ReadFolder(folderPath string) error {
	fmt.Println("Reading folder: ", folderPath)
	files, err := os.ReadDir(folderPath)

	if err != nil {
		return err
	}

	for _, file := range files {
		fmt.Println("File: ", file.Name())
	}

	return nil
}
