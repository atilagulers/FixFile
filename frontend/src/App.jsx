import {useEffect, useState} from 'react';
//import logo from './assets/images/logo-universal.png';
import './App.css';

import {Greet, GetPath, OrganizeDir} from '../wailsjs/go/main/App';

function App() {
  const [targetDir, setTargetDir] = useState('');
  const [outputDir, setOutputDir] = useState('');
  //  const [isCopySelected, setIsCopySelected] = useState(true);

  const handleFolderSelection = async (pathFunc) => {
    try {
      const folder = await GetPath();
      pathFunc(folder);
      console.log(folder);
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
      <div
        style={{
          display: 'flex',
          gap: '32px',
          padding: '32px',
          width: '100%',
        }}
      >
        <div className="folder-input-container">
          <label className="select-folder-label" htmlFor="target-folder">
            Target folder:{' '}
          </label>
          <button onClick={() => handleFolderSelection(setTargetDir)}>
            Select Folder
          </button>
          <span>{targetDir}</span>
        </div>

        <div className="folder-input-container">
          <label className="select-folder-label" htmlFor="output-folder">
            Output location:
          </label>

          <button onClick={() => handleFolderSelection(setOutputDir)}>
            Select Folder
          </button>
          <span style={{color: 'white', marginLeft: '10px'}}>{outputDir}</span>
        </div>
        {/*<div style={{display: 'flex', justifyContent: 'center', gap: '32px'}}>
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
        </div>*/}
      </div>

      <button
        onClick={organizeFolder}
        className="btn-primary"
        style={{
          fontSize: '16px',
          marginTop: '20px',
        }}
      >
        Organize
      </button>
    </div>
  );
}

export default App;
