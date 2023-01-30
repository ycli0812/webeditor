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

// Actions
import { setCircuit } from './slices/editorSlice';

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

function Editor(props) {
    // 初始化，请求电路模型
    const navTo = useNavigate();
    const dispatch = useDispatch();
    const { filename } = useParams();

    useRequestCircuit(filename);
    const { circuit } = useSelector(state => state.editor.circuit);

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
        </div>
    );
}

export default Editor;