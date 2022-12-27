import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

// Components
import Navbar from './components/Navbar';
import Editor from './pages/Editor';
import Library from './pages/Library';

// Context
import { GlobalContext } from './utils/Context';

function App() {
  const [modified, setModified] = useState(false);

  return (
    <BrowserRouter>
      <GlobalContext.Provider value={{ modified, setModified }}>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path='/editor/:filename' element={<Editor />}></Route>
            <Route path='/' element={<Library />}></Route>
          </Routes>
        </div>
      </GlobalContext.Provider>
    </BrowserRouter>
  );
}

export default App;
