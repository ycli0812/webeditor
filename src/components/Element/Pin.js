import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Context
import { EditorContext } from '../../utils/EditorContext';

function Pin(props) {
    const { relPos } = props;

    const editor = useContext(EditorContext);
    const [centerPos, setCenterPos] = useState({x: 50, y: 50});
    const [pointerPos, setPointerPos] = useState({x: 0, y: 0});
    const [mouseIn, setMouseIn] = useState(false);

    function handleMouseEnter(ev) {
        // console.log(ev);
        setMouseIn(true);
    }

    function handleMouseOut(ev) {
        // console.log(ev);
        setMouseIn(false);
    }

    function handleMouseMove(ev) {
        const { offsetX, offsetY } = ev.nativeEvent;
        setPointerPos({x: offsetX, y: offsetY});
    }

    const line = <line x1={centerPos.x} y1={centerPos.y} x2={pointerPos.x} y2={pointerPos.y} stroke='black' strokeWidth={1}></line>;

    return (
        <g
        fill='none'
        onMouseEnter={handleMouseEnter}
        onMouseOut={handleMouseOut}
        onMouseMove={handleMouseMove}>
            <circle id='active-area' cx={centerPos.x} cy={centerPos.y} r={50} fill='transparent'></circle>
            <circle cx={centerPos.x} cy={centerPos.y} r={3} stroke='red' strokeWidth={1}></circle>
            <circle cx={centerPos.x} cy={centerPos.y} r={1} fill='red'></circle>
            {mouseIn && line}
        </g>
    );
}

export default Pin;