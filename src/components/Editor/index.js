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
    // const [elementSet, setElementSet] = useState({
    //     'R1': {x: 1, y: 1, type: 'resistor', selected: false, active: true},
    //     'R2': {x: 1, y: 4, type: 'resistor', selected: false, active: true},
    //     'BD': {x: 0, y: 0, type: 'breadboard', selected:false, active: true}
    // });

    // Context state
    const [circuit, setCircuit] = useState(circuitModel);
    const [editorStatus, setEditorStatus] = useState('default');
    const [targetElementId, setTargetElementId] = useState('');
    const [anchorPoint, setAnchorPoint] = useState(null);
    const [selectedList, setSelectedList] = useState([]);

    function updatedElementSet(newSet) {
        setCircuit(newSet);
    }

    function toggleStatus(s, targetId) {
        console.log('Editor status:', s, 'Target ID:', targetId);
        setEditorStatus(s);
        setTargetElementId(targetId);
    }

    /**
     * TODO:
     * Editor组件应该向下提供修改元件列表的回调
     * 回调接收的参数应对元件列表的具体结构透明
     * 这些回调包括：
     * 增减元件、移动元件位置、修改元件属性、增加和删除连线
    */
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
            selected: false,
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

    function removeElement(id) {}

    function addLine(p1, p2) {
        let updatedCircuit = {...circuit};
        updatedCircuit.connection.push({
            start: p1,
            end: p2
        });
        setCircuit(updatedElementSet);
    }

    function removeLine(x1, y1, x2, y2) {}

    /**
     * 将所有Model集中到Editor组件中！
    */

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