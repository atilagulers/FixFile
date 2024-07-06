import {useEffect, useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';

import {Greet, GetPath, OrganizeDir} from '../wailsjs/go/main/App';

function App() {
  const [targetDir, setTargetDir] = useState('');
  const [outputDir, setOutputDir] = useState('');

  const handleFolderSelection = async (event, pathFunc) => {
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
      await OrganizeDir(targetDir, outputDir);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="App">
      <div
        style={{
          backgroundColor: '#333',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          padding: '32px',
        }}
      >
        <div>
          <label htmlFor="target-folder">Target folder: </label>
          <input
            type="file"
            id="target-folder"
            placeholder="Select a folder"
            onChange={(e) => handleFolderSelection(e, setTargetDir)}
            directory=""
            webkitdirectory=""
            mozdirectory=""
          />
        </div>

        <div>
          <label htmlFor="output-folder">Output folder: </label>

          <input
            type="file"
            id="output-folder"
            placeholder="Output folder"
            onChange={(e) => handleFolderSelection(e, setOutputDir)}
            directory=""
            webkitdirectory=""
            mozdirectory=""
          />
        </div>
      </div>

      <button onClick={organizeFolder}>Organize</button>
    </div>
  );
}

export default App;
