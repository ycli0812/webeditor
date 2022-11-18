import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Style

// Component
import Canvas from '../Canvas';
import ElementMenu from '../ElementMenu';

class PointerContext {
    validStatus = ['default', 'dragCanvas', 'dragElement', 'adding', 'wiring'];
    isWiring = false;
    isDraggingElement = false;
    isDraggingCanvas = false;
    isAddingComponent = false;
    isMultiSelecting = false;
    isDraggingWire = false;

    init() {
        this.isWiring = false;
        this.isDraggingElement = false;
        this.isDraggingCanvas = false;
        this.isAddingComponent = false;
        this.isMultiSelecting = false;
        this.isDraggingWire = false;
    }

    // setPointerStyle() { }
    // startWiring() { }
    // startAddingComponent() { }
    // startDraggingCanvas() { }
    // startDraggingComponent() { }
    // startDraggingWire() { }

    setPointerStatus(statue, target) {}
}

function Editor(props) {
    const [pointer, setPointer] = useState(new PointerContext);
    const [elementSet, setElementSet] = useState({
        'R1': {x: 1, y: 1, type: 'resistor', selected: false, active: true},
        'R2': {x: 1, y: 4, type: 'resistor', selected: false, active: true}
    });

    function updatedElementSet(newSet) {
        setElementSet(newSet);
    }

    function updatePointerStatus() {}

    // 所有鼠标事件绑定在Editor上：
    // ...
    // 鼠标事件结束

    return (
        <div>
            <Canvas
                canvasWidth={900}
                canvasHeight={600}
                elementSet={elementSet}
                pointerStatus={'default'}
                onUpdateElementSet={updatedElementSet}
                onPointerStatusChange={updatePointerStatus}
            />
            {/* <ElementMenu /> */}
        </div>
    );
}

export default Editor;