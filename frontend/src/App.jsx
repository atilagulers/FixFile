import {useEffect, useState, useCallback} from 'react';
import logo from './assets/images/appicon.png';
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
      <header>
        <img
          src={logo}
          alt="logo"
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '6px',
          }}
        />
        <h1>Fix File</h1>
      </header>
      <div
        style={{
          display: 'flex',
          gap: '32px',
          width: '100%',
          marginBottom: '20px',
        }}
      >
        <Dropzone
          getProps={getTargetRootProps}
          setDir={setTargetDir}
          path={targetDir}
          handleFolderSelection={handleFolderSelection}
        />

        <Dropzone
          getProps={getOutputRootProps}
          setDir={setOutputDir}
          path={outputDir}
          handleFolderSelection={handleFolderSelection}
        />
      </div>

      <button
        onClick={organizeFolder}
        className="btn-primary"
        style={{
          fontSize: '18px',
          marginTop: '20px',
        }}
      >
        Organize
      </button>
    </div>
  );
}

export default App;

const Dropzone = ({getProps, setDir, path, handleFolderSelection}) => {
  return (
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
        {...getProps()}
        onClick={() => {
          handleFolderSelection(setDir);
        }}
      >
        <span>Drag and drop or click to select target folder</span>
        <span>{path}</span>
      </div>
    </div>
  );
};

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
