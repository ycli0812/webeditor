import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Style
import toolbarStyle from './ToolBar.module.css';

// Images
import select from '../../../../assets/select-cursor.svg';
import wire from '../../../../assets/icon_development_git-commit.svg';
import upload from '../../../../assets/upload.svg';

// Utils
import { saveDesign } from '../../../../utils/Request';
import { setEditorStatus } from '../../slices/editorSlice';

// Redux actions
import { setModified } from '../../slices/editorSlice';

function ToolBar(props) {
    const dispatch = useDispatch();

    const { circuit } = useSelector(state => state.editor);

    const { filename } = useParams();

    function uploadCircuit(ev) {
        console.log('upload circuit');
        saveDesign(filename, circuit).then((res) => {
            console.log(res);
            alert('保存成功');
            // global.setModified(false);
            dispatch(setModified(false));
        }).catch((res) => {
            console.log(res);
            alert('保存失败');
        });
    }

    function changePointer(ev) {
        dispatch(setEditorStatus('wiring'));
    }

    function normalPointer(ev) {
        dispatch(setEditorStatus('default'));
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