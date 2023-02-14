import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useSelector, useDispatch } from 'react-redux';

function Resistor(props) {
    const { x1, y1, x2, y2 } = props;

    const { zoom } = useSelector(state => state.editor);
    const gridSize = zoom * 5;

    return (
        <g>
            <rect id='wire-right' height={4} width={gridSize} y={y1 * gridSize - wireWidth / 2} x={x1 * gridSize} strokeWidth='0'
                stroke='#000000' fill='#000000' />
            <rect id='wire-left' height={4} width={gridSize} y={y2 * gridSize - wireWidth / 2} x={x2 * gridSize} strokeWidth='0'
                stroke='#000000' fill='#000000' />
        </g>
    );
}

export default Resistor;