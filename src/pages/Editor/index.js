import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate, useParams } from 'react-router-dom';

// Style
import editorStyle from './Editor.module.css';

// Component
import Canvas from '../../components/Canvas';
import ElementMenu from '../../components/ElementMenu';
import ToolBar from '../../components/ToolBar';
import Pannel from '../../components/Pannel';

// Utils
import { getDesign } from '../../utils/Request';

// Context
// 当前编辑器状态，合法值：default, wiring, placing, draggingComp, dragginCanvas
import { EditorContext, GlobalContext } from '../../utils/Context';

// Model and Data
import circuitModel from '../../utils/CircuitModel';
import Navbar from '../../components/Navbar';

function Editor(props) {
    // Context state
    const [circuit, setCircuit] = useState({});
    const [editorStatus, setEditorStatus] = useState('default');
    const [targetElementId, setTargetElementId] = useState('');
    const [anchorPoint, setAnchorPoint] = useState(null);
    const [selectedList, setSelectedList] = useState([]);

    // 初始化，请求电路模型
    const navTo = useNavigate();
    const { filename } = useParams();
    useEffect(() => {
        getDesign(filename).then((res) => {
            console.log(res);
            setCircuit(res.data);
        }).catch((res) => {
            console.log(res);
            alert('找不到文件' + filename);
            navTo('/');
        }).finally(() => {
            console.log('init done');
            global.setModified(false);
        });
    }, []);

    const global = useContext(GlobalContext);
    useEffect(() => {
        global.setModified(true);
        console.log('Editor set modified true', circuit);
    }, [circuit]);

    function toggleStatus(s, targetId) {
        console.log('Editor status:', s, 'Target ID:', targetId);
        setEditorStatus(s);
        setTargetElementId(targetId);
    }

    function addElement(id, type, x, y, features) {
        if(id in circuit.elementSet) {
            console.log('element id exist.');
            return;
        }
        let updatedCircuit = {...circuit};
        updatedCircuit.elementSet[id] = {
            type: type,
            x: x,
            y: y,
            features: features
        };
        setCircuit(updatedCircuit);
    }

    function setElementFeature(id, name, value) {
        if(!id in circuit.elementSet) return;
        let updatedCircuit = {...circuit};
        for(let i=0; i<updatedCircuit.elementSet[id].features.length; i++) {
            if(updatedCircuit.elementSet[id].features[i].name == name) {
                updatedCircuit.elementSet[id].features[i].value = value;
                setCircuit(updatedCircuit);
                return;
            }
        }
        // updatedCircuit.elementSet[id].features.push({
        //     name: name,
        //     value: value,
        //     unit: unit
        // });
    }

    function setElementFeatureUnit(id, name, unit) {
        if(!id in circuit.elementSet) return;
        let updatedCircuit = {...circuit};
        for(let i=0; i<updatedCircuit.elementSet[id].features.length; i++) {
            if(updatedCircuit.elementSet[id].features[i].name == name) {
                updatedCircuit.elementSet[id].features[i].unit = unit;
                setCircuit(updatedCircuit);
                return;
            }
        }
    }

    function setElementPos(id, x, y) {
        if(!id in circuit.elementSet) return;
        let updatedCircuit = {...circuit};
        updatedCircuit.elementSet[id].x = x;
        updatedCircuit.elementSet[id].y = y;
        setCircuit(updatedCircuit);
    }

    function removeElement(id) {
        if(!id in circuit.elementSet) {
            console.log('invalid id');
            return;
        }
        delete circuit.elementSet[id];
        setCircuit({...circuit});
        setSelectedList([]);
    }

    function addLine(p1, p2) {
        let updatedCircuit = {...circuit};
        let wireNum = 0;
        while('w' + wireNum in updatedCircuit.elementSet) wireNum++;
        updatedCircuit.elementSet['w' + wireNum] = {
            type: 'wire',
            x: p1.x,
            y: p1.y,
            features: [
                {
                    name: 'x1',
                    value: p1.x
                },
                {
                    name:'y1',
                    value: p1.y
                },
                {
                    name: 'x2',
                    value: p2.x
                },
                {
                    name: 'y2',
                    value: p2.y
                }
            ]
        }
        // updatedCircuit.connection.push({
        //     start: p1,
        //     end: p2
        // });
        setCircuit(updatedCircuit);
    }

    function removeLine(index) {
        let updatedCircuit = {...circuit};
        let removed = [];
        for(let i in updatedCircuit.connection) {
            if(i != index) removed.push(updatedCircuit.connection[i]);
        }
        updatedCircuit.connection = removed;
        setCircuit(updatedCircuit);
    }

    return (
        <div id={editorStyle.editor}>
            <EditorContext.Provider value={{
                circuit: circuit,
                addElement: addElement,
                setElementFeature: setElementFeature,
                setElementFeatureUnit: setElementFeatureUnit,
                setElementPos: setElementPos,
                removeElement: removeElement,
                addLine: addLine,
                removeLine: removeLine,
                status: editorStatus,
                targetElementId: targetElementId,
                toggleStatus: toggleStatus,
                anchorPoint: anchorPoint,
                setAnchorPoint: setAnchorPoint,
                selectedList: selectedList,
                setSelectedList: setSelectedList
            }}>
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
            </EditorContext.Provider>
        </div>
    );
}

export default Editor;