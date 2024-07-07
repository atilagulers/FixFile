import {useEffect, useState, useCallback} from 'react';
import logo from './assets/images/appicon.png';
import './App.css';
import {SelectFolder, OnFileDrop, OrganizeDir} from '../wailsjs/go/main/App';
import {useDropzone} from 'react-dropzone';

function App() {
  const [targetDir, setTargetDir] = useState('');
  const [outputDir, setOutputDir] = useState('');
  const [isCopySelected, setIsCopySelected] = useState(true);
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const displayNotification = (message) => {
    setNotification(message);
    setShowNotification(true);
  };

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
      if (!targetDir || !outputDir) {
        displayNotification('Please select target and output folders');
        return;
      }

      displayNotification('Organizing files...');
      await OrganizeDir(targetDir, outputDir, isCopySelected);

      displayNotification('Files organized successfully');
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

      <Notification message={notification} show={showNotification} />
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
              disabled={!targetDir || !outputDir}
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

const Notification = ({message, show}) => {
  return (
    <div className={`top-notification ${show ? 'show' : ''}`}>{message}</div>
  );
};
