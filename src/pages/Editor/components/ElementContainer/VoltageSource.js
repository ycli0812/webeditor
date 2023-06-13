import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useSelector, useDispatch } from 'react-redux';

// Hooks
import { useFeatureValueGetter, useFeatureUnitGetter, usePinPositionGetter } from '../../hooks/ElementFeatureSelector';

function VoltageSource(props) {
    // destruct props
    const { id, pixelX, pixelY, onMouseDown } = props;

    // use hooks
    const { x, y } = useSelector(state => state.editor.circuit.elementSet[id]);
    // const getValue = useFeatureValueGetter(id);
    // const getUnit = useFeatureUnitGetter(id);
    // const getPinPos = usePinPositionGetter(id);
    const { x: gridX, y: gridY } = useSelector(state => state.editor.circuit.elementSet[id]);
    const { gridX: gridCenterX, gridY: gridCenterY, zoom, status } = useSelector(state => state.editor);


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
        <g key={id} transform={`translate(${pixelX} ${pixelY})`} onMouseDown={handleMouseDown}>
            <rect width="500" height="300" fill="rgb(35, 112, 36)" />
            <rect x="375" y="75" width="50" height="50" stroke="rgb(0, 0, 0)" />
            <rect x="375" y="175" width="50" height="50" stroke="rgb(0, 0, 0)" />
            <ellipse stroke="rgb(255, 255, 255)" stroke-width="4px" fill="none" cx="150" cy="150" rx="100" ry="100"/>
            <path d="M 162.254 153.873 L 125.367 58.669 L 139.005 58.669 L 163.748 127.831 Q 166.735 136.144 168.748 143.417 Q 170.956 135.624 173.879 127.831 L 199.595 58.669 L 212.454 58.669 L 175.178 153.873 Z" transform="matrix(0.969952, 0, 0, 1, -14.186452, 51.825439)" fill="rgb(255, 253, 253)" />
            <rect x="390" y="90" width="20" height="20" stroke="rgb(0, 0, 0)" fill="rgb(205, 205, 205)"/>
            <rect x="390" y="190" width="20" height="20" stroke="rgb(0, 0, 0)" fill="rgb(205, 205, 205)"/>
        </g>
    );
}

export default VoltageSource;