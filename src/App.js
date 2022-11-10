import './App.css';

// Components
import Canvas from './components/Canvas';

function App() {
  return (
    <div className="App">
      <Canvas canvasWidth={1000} canvasHeight={600} />
    </div>
  );
}

export default App;
