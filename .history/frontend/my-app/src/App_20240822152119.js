import React, { useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragItem from './DragItem';
import DropZone from './DropZone';
import axios from 'axios';
import './App.css';


function App() {
  const [randomInput, setRandomInput] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [fileToBeSent, setFileToBeSent] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (event) => {
    setRandomInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const documentData = {
      test: randomInput
    };

    try {
      const response = await fetch('http://localhost:5000/document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(documentData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setResponseMessage(`Document added with ID: ${result._id}`);
      } else {
        setResponseMessage(`Error: ${result.error}`);
      }
      
    } catch (error) {
      setResponseMessage('Error: Failed to add document');
    }
  };
  const uploadFile = (event) => {
    event.preventDefault();
    const formData = new FormData();
  
    formData.append("file", fileToBeSent);
  
    axios.post("http://localhost:5000/upload", formData)
        .then(res => console.log(res))
        .catch(err => console.warn(err));
  };

  const handleFileChange = (event) => {
    setFileToBeSent(event.target.files[0]);
  };
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  return (
    <div className="App">
      <header className='App-header'>
      <form onSubmit = {uploadFile}>
        <button type = "button" onClick = {handleButtonClick}> 
          Choose File 
        </button>
        {fileToBeSent && <p>{fileToBeSent.name}</p>}
        <input
          type = "file"
          ref = {fileInputRef}
          onChange = {handleFileChange}
          style = {{display:'none'}}
        />
        <button type = "submit">Upload File </button>
      </form>
      <img
          src={require('./vit.png')}
          className="App-logo"
          alt="logo"
        />
      <form onSubmit={handleSubmit}>
          <label>
            <input type="text" value={randomInput} onChange={handleInputChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
        <p>{responseMessage}</p>

      </header>
    </div>
  );
}

export default App;
