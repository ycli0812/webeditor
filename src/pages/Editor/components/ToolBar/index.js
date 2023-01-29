import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Style
import toolbarStyle from './ToolBar.module.css';

// Images
import select from '../../../../res/select-cursor.svg';
import wire from '../../../../res/icon_development_git-commit.svg';
import upload from '../../../../res/upload.svg';

// Context
import { GlobalContext, EditorContext } from '../../../../utils/Context';

// Utils
import { saveDesign } from '../../../../utils/Request';

function ToolBar(props) {
    const editor = useContext(EditorContext);
    const global = useContext(GlobalContext);

    const { circuit } = useSelector(state => state.circuit);

    const { filename } = useParams();
    console.log(filename);
    function uploadCircuit(ev) {
        console.log('upload circuit');
        saveDesign(filename, circuit).then((res) => {
            console.log(res);
            alert('保存成功');
            // global.setModified(false);
        }).catch((res) => {
            console.log(res);
            alert('保存失败');
        });
    }

    function changePointer(ev) {
        editor.toggleStatus('wiring');
    }

    function normalPointer(ev) {
        editor.toggleStatus('default');
    }

    return (
        <div className={toolbarStyle.toolbar}>
            <button className={toolbarStyle.toolbarBtn} onClick={uploadCircuit}>
                <img alt='' src={upload}></img>
            </button>
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