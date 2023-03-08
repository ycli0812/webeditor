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
import { initIndexDb, login } from './app/globalSlice';
import useIndexedDB from './hooks/useIndexedDB';

function App() {
  const dispatch = useDispatch();

  // const [db, dbLoaded] = useIndexedDB();

  useEffect(() => {
    const userName = Cookies.get('user');
    if(userName !== undefined) {
      dispatch(login(true));
    }
    // document.oncontextmenu = (ev) => {
    //   ev.preventDefault()
    // };
  }, []);

  // useEffect(() => {
  //   if(dbLoaded) {
  //     dispatch(initIndexDb(db));
  //   }
  // }, [dbLoaded]);

  const { logined } = useSelector(state => state.global);

  return (
    <BrowserRouter>
      {/* <GlobalContext.Provider value={{ modified, setModified }}> */}
      {/* <Provider store={store}> */}
        <div className="app">
          {logined ? <Navbar /> : null}
          <Routes>
            <Route path='/editor' element={<Editor />}></Route>
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
