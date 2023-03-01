import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import { Alert, message, Modal, Button } from 'antd';

// Hooks
import useIndexedDB from '../../hooks/useIndexedDB';
import useCircuitLoader from '../Library/hooks/useCircuitLoader';

function useRequestElementList() {
    console.log('load templates');
    const dispatch = useDispatch();
    useEffect(() => {
        // TODO: send request
        const temps = [
            {
                type: 'resistor',
                text: '电阻',
                pins: [
                    {
                        name: 'start',
                        x: 0,
                        y: 0
                    },
                    {
                        name: 'end',
                        x: 0,
                        y: 0
                    }
                ],
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
                pins: [],
                defaultFeatures: [
                    {
                        name: 'column',
                        value: 10
                    },
                    {
                        name: 'extended',
                        value: true
                    }
                ]
            },
            {
                type: 'capacitor',
                text: '电容器',
                defaultFeatures: [
                    {
                        name: 'capacity',
                        value: 1,
                        unit: 'f'
                    }
                ]
            },
            {
                type: 'wire',
                text: '导线',
                pins: [],
                defaultFeatures: [
                    {
                        name: 'x1',
                        value: 0
                    },
                    {
                        name: 'x2',
                        value: 0
                    },
                    {
                        name: 'y1',
                        value: 0
                    },
                    {
                        name: 'y2',
                        value: 0
                    },
                    {
                        name: 'color',
                        value: '#000000'
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
    // const { filename } = useParams();
    const { filename, source, _id } = useLocation().state;

    const [msg, contextHolderMsg] = message.useMessage();
    const [modal, contextHolderModal] = Modal.useModal();
    // const [db, dbConnected] = useIndexedDB();

    const [circuit, circuitStatus] = useCircuitLoader({ filename, source, _id });

    useEffect(() => {
        dispatch(initEditor());

        return () => {
            dispatch(initEditor());
        }
    }, []);

    useRequestElementList();

    // init by querying DB and loading local file
    useEffect(() => {
        switch (circuitStatus) {
            case 'loading': {
                msg.open({
                    key: 'loading_msg',
                    type: 'loading',
                    content: 'Loading'
                });
                break;
            }
            case 'success': {
                msg.destroy();
                dispatch(setCircuit(circuit));
                break;
            }
            case 'denied': {
                msg.destroy();
                modal.error({
                    title: 'Error',
                    content: 'Can not load the circuit. Access to local file is denied.',
                    onOk: (close) => {
                        close();
                        navigateTo(-1);
                    },
                    keyboard: false
                });
                break;
            }
            case 'not found': {
                msg.destroy();
                modal.error({
                    title: 'Error',
                    content: 'Can not load the circuit. The file may have been deleted or moved to somewhere else.',
                    onOk: (close) => {
                        close();
                        navigateTo(-1);
                    },
                    keyboard: false
                });
                break;
            }
            case 'invalid file': {
                msg.destroy();
                modal.error({
                    title: 'Error',
                    content: 'Can not load the circuit. The file is not a circuit or it has broken.',
                    onOk: (close) => {
                        close();
                        navigateTo(-1);
                    },
                    keyboard: false
                });
                break;
            }
            case 'request error': {
                msg.destroy();
                modal.error({
                    title: 'Error',
                    content: 'Can not load the circuit. Please try again later.',
                    onOk: (close) => {
                        close();
                        navigateTo(-1);
                    },
                    keyboard: false
                });
                break;
            }
            default: {
                msg.destroy();
                break;
            }
        }
    }, [circuitStatus]);

    const errorModal = (
        <Modal
            title='Error'
            open
            closable={false}
            maskClosable={false}
            footer={<Button type='primary' onClick={() => navigateTo(-1)}>Ok</Button>}
        >
            <p>Sorry, we can not load this file. As The file can not be parsed into a circuit.</p>
        </Modal>
    );

    return (
        <div id={editorStyle.editor}>
            <div id={editorStyle.left}>
                <ElementMenu />
            </div>
            <div id={editorStyle.middle}>
                <ToolBar />
                <Alert.ErrorBoundary description={errorModal}>
                    <Canvas
                        canvasWidth={window.innerWidth - 402}
                        canvasHeight={window.innerHeight - 94}
                    />
                </Alert.ErrorBoundary>
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