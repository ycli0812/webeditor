import React from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';

// Style
import navbarStyle from './Navbar.module.css';

// Images
import list from '../../res/list.svg';

function Navbar(props) {
    const navTo = useNavigate();

    function toLibrary(ev) {
        navTo('/');
    }
    return (
        <div className={navbarStyle.navbar}>
            <img alt='' src={list} draggable={false} onClick={toLibrary}></img>
            <div className={navbarStyle.title}>
                <span className={navbarStyle.folderName}>folder/</span>
                <span className={navbarStyle.fileName}>filename</span>
            </div>
        </div>
    );
}

export default Navbar;