import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Style

// Component
import Canvas from '../Canvas';
import ElementMenu from '../ElementMenu';
import ToolBar from '../ToolBar';

// Utils
// import EditorContext from '../../utils/EditorContext';

// Context
// 当前编辑器状态，合法值：default, wiring, placing, draggingComp, dragginCanvas
import { EditorContext } from '../../utils/EditorContext';

function Editor(props) {
    const [elementSet, setElementSet] = useState({
        'R1': {x: 1, y: 1, type: 'resistor', selected: false, active: true},
        'R2': {x: 1, y: 4, type: 'resistor', selected: false, active: true}
    });
    const [wireList, setWireList] = useState([
        {
            start: {elementId: 'R1', pinId: 'o1'},
            end: {elementId: 'R2', pinId: 'o1'}
        }
    ]);

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

    return (
        <div>
            <EditorContext.Provider value={{
                status: editorStatus,
                toggleStatus: toggleStatus,
                targetElementId: targetElementId
            }}>
                <Canvas
                    canvasWidth={300}
                    canvasHeight={300}
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