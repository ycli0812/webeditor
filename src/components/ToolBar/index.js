import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import toolbarStyle from './ToolBar.module.scss';

// Images
import select from '../../res/select-cursor.svg';
import wire from '../../res/icon_development_git-commit.svg';

// Context
import { EditorContext } from '../../utils/EditorContext';

function ToolBar(props) {
    const editor = useContext(EditorContext);

    function changePointer(ev) {
        editor.toggleStatus('wiring');
    }

    function normalPointer(ev) {
        editor.toggleStatus('default');
    }

    return (
        <div className={toolbarStyle.toolbar}>
            <button className={toolbarStyle.toolbarBtn} onClick={normalPointer}>
                <img alt='' src={select}></img>
            </button>
            <button className={toolbarStyle.toolbarBtn} onClick={changePointer}>
                <img alt='' src={wire}></img>
            </button>
        </div>
    );
}

export default ToolBar;