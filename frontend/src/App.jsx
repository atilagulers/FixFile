import {useEffect, useState, useCallback} from 'react';
import logo from './assets/images/appicon.png';
import './App.css';
import {SelectFolder, OnFileDrop, OrganizeDir} from '../wailsjs/go/main/App';
import {useDropzone} from 'react-dropzone';

function App() {
  const [targetDir, setTargetDir] = useState('');
  const [outputDir, setOutputDir] = useState('');
  //  const [isCopySelected, setIsCopySelected] = useState(true);

  const onDropTarget = useCallback(async () => {
    const dir = await OnFileDrop();
    setTargetDir(dir);
  }, []);

  const onDropOutput = useCallback(async (acceptedFiles) => {
    const dir = await OnFileDrop();

    setOutputDir(dir);
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
      const folder = await SelectFolder();
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

      <div>
        <div className="dropzone-container">
          <Dropzone
            label="Target Folder:"
            getProps={getTargetRootProps}
            setDir={setTargetDir}
            path={targetDir}
            handleFolderSelection={handleFolderSelection}
          />

          <Dropzone
            label="Output Location:"
            getProps={getOutputRootProps}
            setDir={setOutputDir}
            path={outputDir}
            handleFolderSelection={handleFolderSelection}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              gridColumn: '1 / -1',
            }}
          >
            <button
              onClick={organizeFolder}
              className="btn-primary"
              style={{
                fontSize: '20px',
              }}
            >
              Organize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

const Dropzone = ({label, getProps, setDir, path, handleFolderSelection}) => {
  return (
    <div className="dropzone">
      <label>{label}</label>
      <div
        className="folder-input-container"
        {...getProps()}
        onClick={() => {
          handleFolderSelection(setDir);
        }}
      >
        <span>Drag and drop or click to select target folder</span>
      </div>
      <span
        style={{
          marginTop: '8px',
        }}
      >
        {path}
      </span>
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
