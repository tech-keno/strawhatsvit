import React, { useState } from 'react';
import './App.css';

function App() {
  const [randomInput, setRandomInput] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleInputChange = (event) => {
    setRandomInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const documentData = {
      randomField: randomInput
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

  return (
    <div className="App">
      <header className="App-header">
        <img src={require('./logo.svg').default} className="App-logo" alt="logo" />
        <form onSubmit={handleSubmit}>
          <label>
            <input type="text" value={randomInput} onChange={handleInputChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
        <p>{responseMessage}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
