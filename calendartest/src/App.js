import logo from './logo.svg';
import './App.css';
import MyComponent from './components/myComponents';
import Calendar from './components/calendar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h3>yay</h3>
        <MyComponent></MyComponent>
        <p>calendar component</p>
        <Calendar></Calendar>
      </header>
    </div>
  );
}

export default App;
