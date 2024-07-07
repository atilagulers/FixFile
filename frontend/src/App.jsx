import {useEffect, useState, useCallback} from 'react';
//import logo from './assets/images/logo-universal.png';
import './App.css';
import {GetPath, OrganizeDir} from '../wailsjs/go/main/App';
import {useDropzone} from 'react-dropzone';

function App() {
  const [targetDir, setTargetDir] = useState('');
  const [outputDir, setOutputDir] = useState('');
  //  const [isCopySelected, setIsCopySelected] = useState(true);

  const onDropTarget = useCallback((acceptedFiles) => {
    console.log('Dropped files in target:', acceptedFiles);
  }, []);

  const onDropOutput = useCallback((acceptedFiles) => {
    console.log('Dropped files in output:', acceptedFiles);
  }, []);

  const {getRootProps: getTargetRootProps, isDragActive: isTargetDragActive} =
    useDropzone({
      onDrop: onDropTarget,
    });

  const {getRootProps: getOutputRootProps, isDragActive: isOutputDragActive} =
    useDropzone({
      onDrop: onDropOutput,
    });

  const handleFolderSelection = async (pathFunc) => {
    try {
      const folder = await GetPath();
      pathFunc(folder);
    } catch (err) {
      console.error(err);
    }
  };

  const organizeFolder = async () => {
    try {
      await OrganizeDir(targetDir, outputDir, isCopySelected);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="app">
      <h1>Fix File</h1>

      {/*<div style={{backgroundColor: 'gray'}}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>*/}

      <div
        style={{
          display: 'flex',
          gap: '32px',
          width: '100%',
          marginBottom: '20px',
        }}
      >
        <div
          className="folder-input-container"
          {...getTargetRootProps()}
          onClick={() => {
            handleFolderSelection(setTargetDir);
          }}
        >
          <span>Drag and drop or click to select target folder</span>
          <span>{targetDir}</span>
        </div>

        <div className="folder-input-container" {...getOutputRootProps()}>
          <span>Drag and drop or click to select output folder</span>
          <span>{outputDir}</span>
        </div>
      </div>

      <button
        onClick={organizeFolder}
        className="btn-primary"
        style={{
          fontSize: '16px',
          marginTop: '20px',
          width: '100%',
        }}
      >
        Organize
      </button>
    </div>
  );
}

export default App;

{
  /*<div style={{display: 'flex', justifyContent: 'center', gap: '32px'}}>
          <div>
            {' '}
            <label htmlFor="copy">Copy files: </label>
            <input
              type="radio"
              id="copy"
              onChange={() => setIsCopySelected(!isCopySelected)}
              checked={isCopySelected}
            />
          </div>
          <div>
            <label htmlFor="cut">Cut files: </label>

            <input
              type="radio"
              id="cut"
              onChange={() => setIsCopySelected(!isCopySelected)}
              checked={!isCopySelected}
            />
          </div>
        </div>*/
}
