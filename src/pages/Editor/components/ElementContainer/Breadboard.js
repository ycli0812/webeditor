import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useSelector, useDispatch } from 'react-redux';

// Hooks
import { useFeatureValueGetter, useFeatureUnitGetter, usePinPositionGetter } from '../../hooks/ElementFeatureSelector';

function Breadboard(props) {
    // destruct props
    const { id, pixelX, pixelY, onMouseDown } = props;

    // use hooks
    const { x, y } = useSelector(state => state.editor.circuit.elementSet[id]);
    const getValue = useFeatureValueGetter(id);
    const getUnit = useFeatureUnitGetter(id);
    const getPinPos = usePinPositionGetter(id);
    const { x: gridX, y: gridY } = useSelector(state => state.editor.circuit.elementSet[id]);
    const { gridX: gridCenterX, gridY: gridCenterY, zoom, status } = useSelector(state => state.editor);

    const cols = getValue('column');
    const extended = getValue('extended');

    // base board
    const board = (
        <rect x='0' y={extended ? 0 : 300} height={extended ? 18 * 100 : 12 * 100} width={(cols + 1) * 100} fill='#EAEAEA' />
    );
    
    // holes
    const holes = [];
    const getHole = (col, row) => {
        const holeSize = 60;
        let x = (col + 1) * 100 - holeSize / 2;
        let y = (row + 1) * 100 - holeSize / 2;
        if(row >= 2) y += 100;
        if(row >= 7) y += 100;
        if(row >= 12) y += 100;
        return (
            <rect key={row * cols + col} x={x} y={y} height={holeSize} width={holeSize} fill='#444444' stroke='#E4E4E4' strokeWidth={26} />
        );
    };
    for(let i = (extended ? 0 : 2); i < (extended ? 14 : 12); i++) {
        for(let j = 0; j < cols; j++) {
            holes.push(getHole(j, i));
        }
    }

    // number labels
    const labels = [];
    const getNumberLabel = (nCol, offsetY) => {
        if(nCol % 5 != 4) return null;
        return (
            <text key={String(offsetY) + String(nCol)} x={(nCol + 1) * 100} y={offsetY} fontSize={50} fontFamily='consolas' style={{fill: '#B0B0B0'}} textAnchor='middle' fontWeight={600}>{nCol + 1}</text>
        );
    };
    for(let i = 0; i < cols; i++) {
        labels.push(getNumberLabel(i, 355));
        labels.push(getNumberLabel(i, 1480));
    }

    function handleMouseDown(ev) {
        if (status === 'wiring' || status === 'adding') return;
        ev.stopPropagation();
        const { offsetX, offsetY } = ev.nativeEvent;
        const initOffset = {
            x: offsetX - gridCenterX - zoom * 5 * gridX,
            y: offsetY - gridCenterY - zoom * 5 * gridY
        };
        onMouseDown(id, initOffset.x, initOffset.y);
    }

    return (
        <g transform={`translate(${pixelX} ${pixelY})`} onMouseDown={handleMouseDown}>
            {board}
            <rect x={0} y={875} height={50} width={100 * (cols + 1)} fill='#C9C9C9' stroke='none' />
            {holes}
            {labels}
        </g>
    );
}

export default Breadboard;