package main

import (
	"context"
	"fmt"
	"io"
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

func (a *App) OrganizeDir(targetPath, outputPath string, isCopy bool) error {
	fmt.Println("Reading folder: ", targetPath)
	fmt.Println("Output folder: ", outputPath)
	var files []fs.DirEntry
	err := walkDir(&files, targetPath)

	if err != nil {
		return err
	}

	outputBaseDir := filepath.Join(outputPath, filepath.Base(targetPath)+"_organized")
	err = os.MkdirAll(outputBaseDir, 0750)
	if err != nil {
		return err
	}

	for _, file := range files {
		ext := filepath.Ext(file.Name())
		// delete "." from extension
		if len(ext) > 0 {
			ext = ext[1:]
		} else {
			ext = "unknown"
		}

		// create folder for extension
		extDirPath := filepath.Join(outputBaseDir, ext)
		err := os.MkdirAll(extDirPath, 0750)
		if err != nil {
			log.Printf("Failed to create directory %s: %v", extDirPath, err)
			continue
		}

		srcFilePath := filepath.Join(targetPath, file.Name())
		destFilePath := filepath.Join(extDirPath, file.Name())

		fmt.Println("SRC: ", srcFilePath)
		fmt.Println("DEST: ", destFilePath)

		err = os.Rename(srcFilePath, destFilePath)
		//if isCopy {
		//	err = copyFile(srcFilePath, destFilePath)
		//} else {
		//	err = os.Rename(srcFilePath, destFilePath)
		//}

		if err != nil {
			log.Printf("Failed to move file %s to %s: %v", srcFilePath, destFilePath, err)
		}
	}

	return nil
}

func walkDir(files *[]fs.DirEntry, dirPath string) error {

	err := filepath.WalkDir(dirPath, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() {
			*files = append(*files, d)

		}
		return nil
	})

	if err != nil {
		return err
	}

	return nil
}

func copyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	destinationFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destinationFile.Close()

	_, err = io.Copy(destinationFile, sourceFile)
	if err != nil {
		return err
	}

	err = destinationFile.Sync()
	if err != nil {
		return err
	}

	return nil
}
