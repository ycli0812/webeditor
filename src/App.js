import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

// Style
import './App.css';

// Components
import Navbar from './components/Navbar';
import Editor from './pages/Editor';
import Library from './pages/Library';
import Login from './pages/Login';

// Redux actions
import { login } from './app/globalSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userName = Cookies.get('user');
    console.log('App effect');
    if(userName !== undefined) {
      console.log('App set state');
      dispatch(login(true));
    }
  }, []);

  const { logined } = useSelector(state => state.global);

  return (
    <BrowserRouter>
      {/* <GlobalContext.Provider value={{ modified, setModified }}> */}
      {/* <Provider store={store}> */}
        <div className="app">
          {logined ? <Navbar /> : null}
          <Routes>
            <Route path='/editor/:filename' element={<Editor />}></Route>
            <Route path='/library' element={<Library />}></Route>
            <Route path='/' element={<Login />}></Route>
          </Routes>
        </div>
      {/* </Provider> */}
      {/* </GlobalContext.Provider> */}
    </BrowserRouter>
  );
}

export default App;
