package main

import (
	"context"
	"fmt"
	"io"
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

func (a *App) SelectFolder() (string, error) {
	folder, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select a Folder",
	})
	if err != nil {
		return "", err
	}
	return folder, nil
}

func (a *App) OnFileDrop() string {
	pathChan := make(chan string, 1)
	runtime.OnFileDrop(a.ctx, func(x, y int, paths []string) {
		if len(paths) > 0 {
			fmt.Println("Files dropped: ", paths[0])
			pathChan <- paths[0]
		}
	})

	path := <-pathChan // Wait to receive the path from the channel
	return path
}

func (a *App) OrganizeDir(targetPath, outputPath string, isCopy bool) error {
	fmt.Println("Reading folder: ", targetPath)
	fmt.Println("Output folder: ", outputPath)

	runtime.LogTrace(a.ctx, "Reading folder: %s")

	var files []string
	err := walkDir(&files, targetPath)

	if err != nil {
		return err
	}

	outputBaseDir := filepath.Join(outputPath, filepath.Base(targetPath)+"_organized")
	err = os.MkdirAll(outputBaseDir, 0750)
	if err != nil && !os.IsExist(err) {
		return err
	}

	for _, file := range files {
		ext := filepath.Ext(file)
		// delete "." from extension
		ext = ext[1:]

		// create folder for extension
		extDirPath := filepath.Join(outputBaseDir, ext)
		err := os.MkdirAll(extDirPath, 0750)
		if err != nil && !os.IsExist(err) {
			log.Printf("Failed to create directory %s: %v", extDirPath, err)
			continue
		}

		srcFilePath := file
		destFilePath := filepath.Join(extDirPath, filepath.Base(file))

		fmt.Println("SRC: ", srcFilePath)
		fmt.Println("DEST: ", destFilePath)

		if isCopy {
			err = copyFile(srcFilePath, destFilePath)
		} else {
			err = os.Rename(srcFilePath, destFilePath)
		}

		if err != nil {
			log.Printf("Failed to process file %s: %v", file, err)
		}
	}

	return nil
}

func walkDir(files *[]string, dirPath string) error {
	err := filepath.WalkDir(dirPath, func(path string, d os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() {
			*files = append(*files, path)
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
