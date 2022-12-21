import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

// Components
import Navbar from './components/Navbar';
import Editor from './pages/Editor';
import Library from './pages/Library';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path='/editor/:filename' element={<Editor />}></Route>
          <Route path='/' element={<Library />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
