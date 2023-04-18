import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useParams, useLocation } from 'react-router-dom';
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
import { generateTypeId } from '../../../../utils/IdGenerator';

// Redux actions
import { setModified, setTragetElement } from '../../slices/editorSlice';

// Antd components
import { message } from 'antd';

// Hooks
import useIndexedDB from '../../../../hooks/useIndexedDB';

function ToolBar(props) {
    const dispatch = useDispatch();
    const { circuit, modified } = useSelector(state => state.editor);
    const { elementSet } = useSelector(state => state.editor.circuit);
    const [msg, contextHolder] = message.useMessage();
    const { filename, source, _id } = useLocation().state;
    const [handler, setHandler] = useState(null);
    const [db, dbConnected] = useIndexedDB();

    useEffect(() => {
        if (source === 'local' && dbConnected) {
            const request = db
                .transaction(['localFileHandlers'], 'readwrite')
                .objectStore('localFileHandlers')
                .get(_id);
            request.onsuccess = (res) => {
                const { name, lastEdit, handler } = res.target.result;
                setHandler(handler);
            };
            request.onerror = (res) => {
                console.log('can not get file handler');
            }
        }
    }, [dbConnected]);

    function uploadCircuit(ev) {
        msg.open({
            key: 'save',
            type: 'loading',
            content: '正在保存'
        });
        saveDesign(filename, circuit).then((res) => {
            console.log(res);
            msg.open({
                key: 'save',
                type: 'success',
                content: '保存成功',
                duration: 1
            });
            dispatch(setModified(false));
        }).catch((res) => {
            console.log(res);
            msg.open({
                key: 'save',
                type: 'error',
                content: '保存失败',
                duration: 1
            });
        });
    }

    async function saveLocalCircuit(ev) {
        msg.open({
            key: 'save',
            type: 'loading',
            content: '正在保存'
        });
        if (await handler.queryPermission({ mode: 'readwrite' }) !== 'granted') {
            if (await handler.requestPermission({ mode: 'readwrite' }) !== 'granted') {
                msg.open({
                    key: 'save',
                    type: 'error',
                    content: '保存失败：无权限',
                    duration: 1
                });
                return;
            }
        }
        try {
            const writer = await handler.createWritable();
            await writer.write(JSON.stringify(circuit));
            await writer.close();
            msg.open({
                key: 'save',
                type: 'success',
                content: '保存成功',
                duration: 1
            });
            dispatch(setModified(false));
        } catch (e) {
            console.log('error', e);
            msg.open({
                key: 'save',
                type: 'error',
                content: '保存失败：无法写入',
                duration: 1
            });
        }
    }

    function changePointer(ev) {
        // dispatch(setEditorStatus('wiring'));
        dispatch(setEditorStatus('adding'));
        dispatch(setTragetElement({
            id: generateTypeId('wire', elementSet),
            type: 'wire'
        }));
    }

    function normalPointer(ev) {
        dispatch(setEditorStatus('default'));
    }

    return (
        <div className={toolbarStyle.toolbar}>
            <button className={toolbarStyle.toolbarBtn} onClick={source === 'cloud' ? uploadCircuit : saveLocalCircuit}>
                <img alt='' src={upload}></img>
            </button>
            <button className={toolbarStyle.toolbarBtn} onClick={normalPointer}>
                <img alt='' src={select}></img>
            </button>
            <button className={toolbarStyle.toolbarBtn} onClick={changePointer}>
                <img alt='' src={wire}></img>
            </button>
            {contextHolder}
        </div>
    );
}

export default ToolBar;