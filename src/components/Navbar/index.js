import React from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate, useLocation } from 'react-router-dom';

// Style
import navbarStyle from './Navbar.module.css';

// Images
import list from '../../res/list.svg';

function Navbar(props) {
    const navTo = useNavigate();
    const location = useLocation();
    const filename = location.pathname.split('/')[2];

    function toLibrary(ev) {
        navTo('/');
    }
    return (
        <div className={navbarStyle.navbar}>
            <img alt='' src={list} draggable={false} onClick={toLibrary}></img>
            <div className={navbarStyle.title}>
                <span className={navbarStyle.folderName}>我的设计/</span>
                <span className={navbarStyle.fileName}>{filename}</span>
            </div>
        </div>
    );
}

export default Navbar;