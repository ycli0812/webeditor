import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate, useParams } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';

// Style
import editorStyle from './Editor.module.css';

// Component
import Canvas from './components/Canvas';
import ElementMenu from './components/ElementMenu';
import ToolBar from './components/ToolBar';
import Pannel from './components/Pannel';

// Utils
import { getDesign } from '../../utils/Request';

// Redux actions
import { setCircuit, initEditor, setElementTemplates } from './slices/editorSlice';

// Antd components
import { message, Modal } from 'antd';

// Hooks
function useRequestCircuit(filename) {
    // const [circuit, setCircuit] = useState({});
    const dispatch = useDispatch();
    const navigateTo = useNavigate();
    useEffect(() => {
        getDesign(filename).then((res) => {
            console.log('get file');
            dispatch(setCircuit(res.data));
        }).catch((res) => {
            console.error('Request circuit error', res);
            // dispatch(setCircuit({}));
            alert('加载失败，点击确定返回首页。');
            navigateTo(-1);
        }).finally(() => {
            
        });
    }, []);
}

function useRequestElementList() {
    const dispatch = useDispatch();
    useEffect(() => {
        // TODO: send request
        const temps = [
            {
                type: 'resistor',
                text: '电阻',
                defaultFeatures: [
                    {
                        name: 'resistance',
                        value: 1,
                        unit: 'om'
                    },
                    {
                        name: 'tolerance',
                        value: '1%'
                    }
                ]
            },
            {
                type: 'breadboard',
                text: '面包板',
                defaultFeatures: [
                    {
                        name: 'column',
                        value: 10
                    }
                ]
            }
        ];
        dispatch(setElementTemplates(temps));
    }, []);
}

function Editor(props) {
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const { filename } = useParams();

    const [msg, contextHolderMsg] = message.useMessage();
    const [modal, contextHolderModal] = Modal.useModal();
    useEffect(() => {
        dispatch(initEditor());
        msg.open({
            key: 'loadCircuit',
            type: 'loading',
            content: '加载中'
        });
        getDesign(filename).then((res) => {
            dispatch(setCircuit(res.data));
            msg.open({
                key: 'loadCircuit',
                type: 'success',
                content: '加载完成',
                duration: 2
            });
        }).catch((res) => {
            console.error('Request circuit error', res);
            modal.error({
                title: 'Error',
                content: 'Can not load the file. May be a bad Internet connection.',
                onOk: (close) => {
                    close();
                    navigateTo(-1);
                },
                keyboard: false
            });
        }).finally(msg.destroy);

        return () => {
            dispatch(initEditor());
        };
    }, []);

    useRequestElementList();

    return (
        <div id={editorStyle.editor}>
            <div id={editorStyle.left}>
                <ElementMenu />
            </div>
            <div id={editorStyle.middle}>
                <ToolBar />
                <Canvas
                    canvasWidth={window.innerWidth - 402}
                    canvasHeight={window.innerHeight - 94}
                />
            </div>
            <div id={editorStyle.right}>
                <Pannel />
                {/* <div>status:{editorStatus}</div> */}
            </div>
            {contextHolderMsg}
            {contextHolderModal}
        </div>
    );
}

export default Editor;