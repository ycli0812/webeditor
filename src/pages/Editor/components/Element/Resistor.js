import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useSelector, useDispatch } from 'react-redux';

// Hooks
import { useFeatureValueGetter, useFeatureUnitGetter, usePinPositionGetter } from '../../hooks/ElementFeatureSelector';

// Utils
import computeColorRing from '../../../../utils/ColorRing';

// Redux actions
import { setTragetElement, setEditorStatus } from '../../slices/editorSlice';

function Resistor(props) {
    // destruct props
    const { id, pixelX, pixelY, onMouseDown } = props;

    // use hooks
    const getValue = useFeatureValueGetter(id);
    const getUnit = useFeatureUnitGetter(id);
    const getPinPos = usePinPositionGetter(id);

    const { x: gridX, y: gridY } = useSelector(state => state.editor.circuit.elementSet[id]);
    const { gridX: gridCenterX, gridY: gridCenterY, zoom } = useSelector(state => state.editor);

    const { x: x1, y: y1 } = getPinPos('start');
    const { x: x2, y: y2 } = getPinPos('end');

    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) * 100;
    const deg = Math.acos((y2 - y1) / length) * 180 / Math.PI;

    const rings = computeColorRing(getValue('resistance'), getUnit('resistance'), getValue('tolerance'));

    function handleMouseDown(ev) {
        ev.stopPropagation();
        console.log('Element click event', ev);
        const { offsetX, offsetY } = ev.nativeEvent;
        console.log(offsetX, offsetY);
        const initOffset = {
            x: offsetX - gridCenterX - zoom * 5 * gridX,
            y: offsetY - gridCenterY - zoom * 5 * gridY
        };
        onMouseDown(id, initOffset.x, initOffset.y);
    }

    return (
        <g key={id} onMouseDown={handleMouseDown} transform={`translate(${pixelX} ${pixelY})`}>
            <rect x="0" y="46" height="8" width={length} fill="silver" />
            <g transform={`translate(${length / 2 - 125},0)`}>
                <path d="M 50,20 C -10,0,-10,100,50,80 L 200,80 C 260,100,260,0,200,20 Z" fill="#19a1d6" />
                <rect x="50" y="20" height="60" width="15" fill={rings[0]} />
                <rect x="110" y="20" height="60" width="15" fill={rings[1]} />
                <rect x="135" y="20" height="60" width="15" fill={rings[2]} />
                <rect x="160" y="20" height="60" width="15" fill={rings[3]} />
                <rect x="185" y="20" height="60" width="15" fill={rings[4]} />
            </g>
        </g>
    );
}

export default Resistor;