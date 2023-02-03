import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { store } from './app/store';
// import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';

import './App.css';

// Components
import Navbar from './components/Navbar';
import Editor from './pages/Editor';
import Library from './pages/Library';
import Login from './pages/Login';


function App() {
  const { logined } = useSelector(state => state.global);

  return (
    <BrowserRouter>
      {/* <GlobalContext.Provider value={{ modified, setModified }}> */}
      {/* <Provider store={store}> */}
        <div className="app">
          {logined ? <Navbar /> : null}
          <Routes>
            <Route path='/editor/:filename' element={<Editor />}></Route>
            <Route path='/' element={<Library />}></Route>
            <Route path='/login' element={<Login />}></Route>
          </Routes>
        </div>
      {/* </Provider> */}
      {/* </GlobalContext.Provider> */}
    </BrowserRouter>
  );
}

export default App;
