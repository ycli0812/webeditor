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

// Antd components
import { message } from 'antd';

function ToolBar(props) {
    const dispatch = useDispatch();

    const { circuit } = useSelector(state => state.editor);

    const { filename } = useParams();

    const [msg, contextHolder] = message.useMessage();

    function uploadCircuit(ev) {
        console.log('upload circuit');
        message.open({
            key: 'save',
            type: 'loading',
            content: '正在保存'
        });
        saveDesign(filename, circuit).then((res) => {
            console.log(res);
            message.open({
                key: 'save',
                type: 'success',
                content: '保存成功',
                duration: 1
            });
            dispatch(setModified(false));
        }).catch((res) => {
            console.log(res);
            message.open({
                key: 'save',
                type: 'error',
                content: '保存失败',
                duration: 1
            });
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