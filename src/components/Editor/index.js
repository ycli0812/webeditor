import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import editorStyle from './Editor.module.scss';

// Component
import Canvas from '../Canvas';
import ElementMenu from '../ElementMenu';
import ToolBar from '../ToolBar';
import Pannel from '../Pannel';

// Utils

// Context
// 当前编辑器状态，合法值：default, wiring, placing, draggingComp, dragginCanvas
import { EditorContext } from '../../utils/EditorContext';

// Model and Data
import circuitModel from '../../utils/CircuitModel';

function Editor(props) {
    // Context state
    const [circuit, setCircuit] = useState(circuitModel);
    const [editorStatus, setEditorStatus] = useState('default');
    const [targetElementId, setTargetElementId] = useState('');
    const [anchorPoint, setAnchorPoint] = useState(null);
    const [selectedList, setSelectedList] = useState([]);

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

    function setElementFeature(id, name, value, unit) {
        if(!id in circuit.elementSet) return;
        let updatedCircuit = {...circuit};
        for(let i=0; i<updatedCircuit.elementSet[id].features.length; i++) {
            if(updatedCircuit.elementSet[id].features[i].name == name) {
                updatedCircuit.elementSet[id].features[i].value = value;
                updatedCircuit.elementSet[id].features[i].unit = unit;
                return;
            }
        }
        updatedCircuit.elementSet[id].features.push({
            name: name,
            value: value,
            unit: unit
        });
        setCircuit(updatedCircuit);
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
                        canvasWidth={document.body.clientWidth - 400}
                        canvasHeight={700}
                    />
                </div>
                <div id={editorStyle.right}>
                    <div>status:{editorStatus}</div>
                    <Pannel />
                </div>
            </EditorContext.Provider>
        </div>
    );
}

export default Editor;