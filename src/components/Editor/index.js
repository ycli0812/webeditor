import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Style

// Component
import Canvas from '../Canvas';
import ElementMenu from '../ElementMenu';
import ToolBar from '../ToolBar';

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
    const [elementSet, setElementSet] = useState(circuitModel.elementSet);

    const [editorStatus, setEditorStatus] = useState('default');
    const [targetElementId, setTargetElementId] = useState('');

    function updatedElementSet(newSet) {
        setElementSet(newSet);
    }

    function toggleStatus(s, targetId) {
        console.log('Editor status:', s, 'Target ID:', targetId);
        setEditorStatus(s);
        setTargetElementId(targetId);
    }

    /**
     * Editor组件应该向下提供修改元件列表的回调
     * 回调接收的参数应对元件列表的具体结构透明
     * 这些回调包括：
     * 增减元件、移动元件位置、修改元件属性、增加和删除连线
    */
    function addElement(id, type, pins, features) {}
    function setElementFeature(id, feature, value, unit) {}
    function setElementPos(id, pinId, x, y) {}
    function removeElement(id) {}
    function addLine(x1, y1, x2, y2) {}
    function removeLine(x1, y1, x2, y2) {}

    /**
     * 将所有Model集中到Editor组件中！
    */

    return (
        <div>
            <EditorContext.Provider value={{
                elementSet: elementSet,
                status: editorStatus,
                targetElementId: targetElementId,
                toggleStatus: toggleStatus,
                addElement: addElement,
                setElementFeature: setElementFeature,
                setElementPos: setElementPos,
                removeElement: removeElement,
                addLine: addLine,
                removeLine: removeLine
            }}>
                <Canvas
                    canvasWidth={600}
                    canvasHeight={600}
                    elementSet={elementSet}
                    onUpdateElementSet={updatedElementSet}
                />
                <ElementMenu
                    elementSet={elementSet}
                    onUpdateElementSet={updatedElementSet}
                />
                <ToolBar />
                <div>{editorStatus}</div>
            </EditorContext.Provider>
        </div>
    );
}

export default Editor;