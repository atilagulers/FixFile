import {useEffect, useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';

import {Greet, GetPath, OrganizeDir} from '../wailsjs/go/main/App';

function App() {
  const [targetDir, setTargetDir] = useState('');
  const [outputDir, setOutputDir] = useState('');
  const [isCopySelected, setIsCopySelected] = useState(true);

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
    <div id="App">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          padding: '32px',
        }}
      >
        <div>
          <label htmlFor="target-folder">Target folder: </label>
          <button onClick={() => handleFolderSelection(setTargetDir)}>
            Select Folder
          </button>
          <span>{targetDir}</span>
        </div>

        <div>
          <label htmlFor="output-folder">Output folder: </label>

          <button onClick={() => handleFolderSelection(setOutputDir)}>
            Select Folder
          </button>
          <span style={{color: 'white', marginLeft: '10px'}}>{outputDir}</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', gap: '32px'}}>
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
        </div>
      </div>

      <button
        onClick={organizeFolder}
        className="btn-primary"
        style={{
          fontSize: '16px',
          marginTop: '20px',
        }}
      >
        {' '}
        Organize
      </button>
    </div>
  );
}

export default App;
