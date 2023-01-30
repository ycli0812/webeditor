import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Style
import navbarStyle from './Navbar.module.css';

// Images
import list from '../../assets/list.svg';

// Redux actions
import { setModified } from '../../pages/Editor/slices/editorSlice';

function Navbar(props) {
    const dispatch = useDispatch();
    const navTo = useNavigate();
    // const { filename } = useParams();
    const filename = useLocation().pathname.split('/')[2];;
    // const global = useContext(GlobalContext);
    const { modified } = useSelector(state => state.editor);

    function toLibrary(ev) {
        if (modified) {
            if(window.confirm('您还未保存，离开将丢失修改，确定要离开吗？')) {
                dispatch(setModified(false));
                navTo('/');
            }
        } else {
            navTo('/');
        }
    }

    return (
        <div className={navbarStyle.navbar}>
            <img alt='' src={list} draggable={false} onClick={toLibrary}></img>
            <div className={navbarStyle.title}>
                <span className={navbarStyle.folderName}>{filename === undefined ? '首页' : '我的设计'}/</span>
                <span className={navbarStyle.fileName}>{filename === undefined ? '' : decodeURI(filename)}</span>
                <span className={navbarStyle.fileName}>{modified ? '*' : ''}</span>
            </div>
        </div>
    );
}

export default Navbar;