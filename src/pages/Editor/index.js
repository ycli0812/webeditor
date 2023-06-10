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
import StatusBar from './components/StatusBar';
import ElementLookup from './components/ElementLookup';
import DynamicGrid from '../../components/DynamicGrid/index.tsx';
import OutputBar from './components/Verifier/index.tsx';

// Redux actions
import { setCircuit, initEditor, setElementTemplates } from './slices/editorSlice';

// Antd components
import { Alert, message, Modal, Button } from 'antd';

// Hooks
import useCircuitLoader from '../Library/hooks/useCircuitLoader';

function useRequestElementList() {
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
                ],
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
            },
            {
                type: 'led',
                text: 'LED',
                pins: [
                    {
                        name: 'positive',
                        x: 0,
                        y: 0
                    },
                    {
                        name: 'negative',
                        x: 0,
                        y: 0
                    }
                ],
                defaultFeatures: []
            },
            {
                type: 'source',
                text: 'Voltage Source',
                pins: [],
                defaultFeatures: [],
            },
        ];
        dispatch(setElementTemplates(temps));
    }, []);
}

function Editor(props) {
    const navigateTo = useNavigate();
    const dispatch = useDispatch();
    const { filename, source, _id } = useLocation().state;

    const [msg, contextHolderMsg] = message.useMessage();
    const [modal, contextHolderModal] = Modal.useModal();

    const [circuit, circuitStatus] = useCircuitLoader({ filename, source, _id });

    const { modified, circuit: realCircuit } = useSelector(state => state.editor);

    const [canvasHeight, setCanvasHeight] = useState((window.innerHeight - 94 - 28) / 2);
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth - 400);

    useEffect(() => {
        dispatch(initEditor(filename, source));

        window.onbeforeunload = (ev) => {
            ev.preventDefault();
            ev.returnValue = '';
        };

        return () => {
            dispatch(initEditor());
            window.onbeforeunload = null;
            window.onpopstate = null;
            window.sessionStorage.removeItem('circuitCache');
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

    const leftLayout = useState([100, 8, 'auto']);

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
        // <div id={editorStyle.editor} style={{ height: window.innerHeight - 52, width: '100%' }}>
        //     <DynamicGrid direction='horizontal'>
        //         <DynamicGrid direction='vertical'>
        //             <ElementMenu />
        //             {/* <div style={{height: 10, borderTop: '1px #AAAAAA solid'}}></div> */}
        //             <ElementLookup />
        //         </DynamicGrid>
        //         <div>
        //             <ToolBar />
        //             <Alert.ErrorBoundary description={errorModal}>
        //                 <Canvas
        //                     canvasWidth={window.innerWidth - 200}
        //                     canvasHeight={window.innerHeight - 94 - 28}
        //                 />
        //             </Alert.ErrorBoundary>
        //             {/* <div style={{width: '100%', backgroundColor: '#F7F7F7', borderTop: '2px solid #EEEEEE'}}></div> */}
        //             <StatusBar />
        //         </div>
        //         <div>
        //             <Pannel />
        //             {/* <div>status:{editorStatus}</div> */}
        //             {contextHolderMsg}
        //             {contextHolderModal}
        //         </div>
        //     </DynamicGrid>
        // </div>

        <div id={editorStyle.editor} style={{ height: window.innerHeight - 52, width: '100%' }}>
            <div id={editorStyle.left} style={{ gridTemplateRows: '300px 8px auto' }}>
                <DynamicGrid direction='vertical'>
                    <ElementMenu />
                    <ElementLookup />
                </DynamicGrid>
            </div>
            <div id={editorStyle.middle}>
                <ToolBar />
                <DynamicGrid direction='vertical' onChange={(layout) => {setCanvasHeight(layout[0])}}>
                    <Alert.ErrorBoundary description={errorModal}>
                        <Canvas canvasWidth={canvasWidth} canvasHeight={canvasHeight} />
                    </Alert.ErrorBoundary>
                    <OutputBar />
                </DynamicGrid>
                <StatusBar />
            </div>
            <div id={editorStyle.right}>
                <Pannel />
            </div>
            {contextHolderMsg}
            {contextHolderModal}
        </div>
    );
}

export default Editor;