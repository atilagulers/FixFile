import {useEffect, useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';

import {Greet, SelectFolder} from '../wailsjs/go/main/App';

function App() {
  const handleFolderSelection = async (event) => {
    try {
      const folder = await SelectFolder();
      setFolderPath(folder);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="App">
      <label htmlFor="selected-folder">Select a folder: </label>
      <input
        type="file"
        id="selected-folder"
        placeholder="Select a folder"
        onChange={handleFolderSelection}
        directory=""
        webkitdirectory=""
        mozdirectory=""
      />
    </div>
  );
}

export default App;
