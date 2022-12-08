import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Context
import { EditorContext } from '../../utils/EditorContext';

function WireContainer(props) {
    const {
        zoom,
        gridCenter,
        onMouseDown
    } = props;

    const editor = useContext(EditorContext);
    const gridSize = zoom * 5;
    const wires = editor.circuit.connection.map((wire, i) => {
        return (
            <g key={i} stroke='#000000' strokeWidth={3}>
                <line x1={wire.start.x * gridSize} y1={wire.start.y * gridSize} x2={wire.end.x * gridSize} y2={wire.end.y * gridSize}></line>
            </g>
        );
    });

    return (
        <g>
            {wires}
        </g>
    );
}

export default WireContainer;