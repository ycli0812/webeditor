import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useSelector, useDispatch } from 'react-redux';

// Hooks
import { useFeatureValueGetter, useFeatureUnitGetter, usePinPositionGetter } from '../../hooks/ElementFeatureSelector';

// Utils
import computeColorRing from '../../../../utils/ColorRing';

// Redux actions
import { setTragetElement, setEditorStatus } from '../../slices/editorSlice';

function Capacitor(props) {
    // destruct props
    const { id, pixelX, pixelY, onMouseDown } = props;

    // use hooks
    const getValue = useFeatureValueGetter(id);
    const getUnit = useFeatureUnitGetter(id);
    const getPinPos = usePinPositionGetter(id);

    const { x: gridX, y: gridY } = useSelector(state => state.editor.circuit.elementSet[id]);
    const { gridX: gridCenterX, gridY: gridCenterY, zoom, status } = useSelector(state => state.editor);

    // find position of pins
    const { x: x1, y: y1 } = getPinPos('start');
    const { x: x2, y: y2 } = getPinPos('end');

    // calculate length and rotate degree
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) * 100;
    let deg = Math.asin((y2 - y1) / length * 100) * 180 / Math.PI;
    if (x2 < x1) deg = 180 - deg;
    // console.log('deg', deg);

    function handleMouseDown(ev) {
        if (status === 'wiring' || status === 'adding') return;
        ev.stopPropagation();
        // console.log('Element click event', ev);
        const { offsetX, offsetY } = ev.nativeEvent;
        // console.log(offsetX, offsetY);
        const initOffset = {
            x: offsetX - gridCenterX - zoom * 5 * gridX,
            y: offsetY - gridCenterY - zoom * 5 * gridY
        };
        onMouseDown(id, initOffset.x, initOffset.y);
    }

    return (
        <g key={id} onMouseDown={handleMouseDown} transform-origin={`${0} ${50}`} transform={`translate(${pixelX} ${pixelY - 50}) rotate(${deg})`}>
            <rect x="0" y="48" height="4" width={length} />
            <g id='body' transform={`translate(${length / 2} 50)`}>
                <linearGradient id="GradientColor" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stop-color="white" />
                    <stop offset="40%" stop-color="#afafaf" />
                    <stop offset="100%" stop-color="white" />
                </linearGradient>
                <circle cx="0" cy="0" r="40" stroke="black" stroke-width="20" fill="url(#GradientColor)" />
            </g>
        </g>
    );
}

export default Capacitor;