import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useSelector, useDispatch } from 'react-redux';

// Hooks
import { useFeatureValueGetter, useFeatureUnitGetter, usePinPositionGetter } from '../../hooks/ElementFeatureSelector';

// Utils
import computeColorRing from '../../../../utils/ColorRing';

// Redux actions
import { setTragetElement, setEditorStatus } from '../../slices/editorSlice';

function Wire(props) {
    // destruct props
    const { id, pixelX, pixelY, onMouseDown } = props;

    // use hooks
    const getValue = useFeatureValueGetter(id);
    const getUnit = useFeatureUnitGetter(id);
    const getPinPos = usePinPositionGetter(id);

    const { x: gridX, y: gridY } = useSelector(state => state.editor.circuit.elementSet[id]);
    const { gridX: gridCenterX, gridY: gridCenterY, zoom, status } = useSelector(state => state.editor);

    // get end positions
    const x1 = getValue('x1') * 100;
    const x2 = getValue('x2') * 100;
    const y1 = getValue('y1') * 100;
    const y2 = getValue('y2') * 100;
    const color = getValue('color');

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
        <g key={id} onMouseDown={handleMouseDown}>
            <line {...{ x1, x2, y1, y2 }} stroke={color} strokeWidth={14} />
        </g>
    );
}

export default Wire;