import MyComponent from './myComponents.js';
import Calendar from './calendar';

export default function Home() {
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
