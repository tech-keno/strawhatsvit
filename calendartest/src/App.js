import logo from './logo.svg';
import './App.css';
import MyComponent from './components/myComponents';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>yay</h3>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        
        <MyComponent></MyComponent>
      </header>
    </div>
  );
}

export default App;
