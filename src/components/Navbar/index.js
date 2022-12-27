import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// Style
import navbarStyle from './Navbar.module.css';

// Images
import list from '../../res/list.svg';

// Context
import { GlobalContext } from '../../utils/Context';

function Navbar(props) {
    const navTo = useNavigate();
    // const { filename } = useParams();
    const filename = useLocation().pathname.split('/')[2];;
    const global = useContext(GlobalContext);

    function toLibrary(ev) {
        if(global.modified) {
            alert('请先保存');
        } else {
            navTo('/');
        }
    }

    return (
        <div className={navbarStyle.navbar}>
            <img alt='' src={list} draggable={false} onClick={toLibrary}></img>
            <div className={navbarStyle.title}>
                <span className={navbarStyle.folderName}>{filename == undefined ? '首页' : '我的设计'}/</span>
                <span className={navbarStyle.fileName}>{filename == undefined ? '' : decodeURI(filename)}</span>
            </div>
        </div>
    );
}

export default Navbar;