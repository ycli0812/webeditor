import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import './Element.scss';

// Utils

// Context
import { EditorContext } from '../../utils/EditorContext';

function Pin(props) {
    const { 
        zoom,           // 放大倍数，grid边长=zoom*5
        wireWidth,      // 元件引脚处线宽
        id,             // 元件id，也是g标签的id，所有id不会重复
    } = props;
    const gridSize = zoom * 5;

    return (
        <g></g>
    );
}

function Resistor(props) {
    const { 
        pixelX,         // 元件相对canvas的像素坐标x
        pixelY,         // 元件相对canvas的像素坐标y
        zoom,           // 放大倍数，grid边长=zoom*5
        wireWidth,      // 元件引脚处线宽
        id,             // 元件id，也是g标签的id，所有id不会重复
        gridCenter,     // grid坐标系原点在canvas中的像素坐标
        selected,       // 元件是否被选中
        active,         // 元件是否捕获鼠标事件，当有元件被选中时，其他元件将不接收鼠标事件
        onMouseDown     // 按下时更新canvas中的初始偏移
    } = props;
    const gridSize = zoom * 5;

    const editor = useContext(EditorContext);

    /**
     * 用回调将元件状态设置为选中，记录按下时指针对元件左上角的像素偏移
     *
     * @param {*} ev 事件实例
     */
    function handleMouseDown(ev){
        ev.stopPropagation();
        editor.toggleStatus('draggingComponent', id);
        onMouseDown(id, ev.nativeEvent.offsetX - gridCenter.x - pixelX, ev.nativeEvent.offsetY - gridCenter.y - pixelY);
    }

    return (
        <g
            id={id}
            onMouseDown={handleMouseDown}
            // onMouseUp={handleMouseUp}
            // onMouseMove={handleMouseMove}
            // onMouseOut={handleMouseOut}
            opacity={selected ? 0.5 : 1}
            style={{pointerEvents: active ? 'auto' : 'none'}}>
            <rect id='body' height={gridSize * 2} width={gridSize * 4} y={pixelY} x={pixelX + gridSize} stroke-dasharray='2'
                stroke-width='1' stroke='#000' fill='transparent' />
            <rect id='wire-right' height={wireWidth} width={gridSize} y={pixelY + gridSize - wireWidth / 2} x={pixelX + 5 * gridSize} stroke-dasharray='5,2,2,2,2,2' stroke-width='0'
                stroke='#000' fill='#000000' />
            <rect id='wire-left' height={wireWidth} width={gridSize} y={pixelY + gridSize - wireWidth / 2} x={pixelX} stroke-dasharray='5,2,2,2,2,2' stroke-width='0'
                stroke='#000' fill='#000000' />
            <text x={pixelX} y={pixelY} fontFamily='Times New Roman'>{id}</text>
        </g>
    );
}


/**
 *
 *
 * @param {*} props
 * @return {*} 
 * @deprecated
 */
function IC(props) {
    const { x, y, zoom, wireWidth } = props;
    const gridSize = zoom * 5;
    const pixelX = x * gridSize, pixelY = y * gridSize;

    return (
        <g id='ic_chip'>
            <title>Layer 1</title>
            <rect stroke-width='0' id='chip' height={gridSize * 5} width={gridSize * 3} y={pixelY} x={pixelX + gridSize} stroke='#000' fill='#666666' />
            <rect id='pin_l1' height={wireWidth} width={gridSize} y={pixelY + gridSize - wireWidth / 2} x={pixelX} stroke-width='0' stroke='#000' fill='#000000' />
            <rect id='pin_l2' height={wireWidth} width={gridSize} y={pixelY + gridSize * 2 - wireWidth / 2} x={pixelX} stroke-width='0' stroke='#000' fill='#000000' />
            <rect id='pin_l3' height={wireWidth} width={gridSize} y={pixelY + gridSize * 3 - wireWidth / 2} x={pixelX} stroke-width='0' stroke='#000' fill='#000000' />
            <rect id='pin_l4' height={wireWidth} width={gridSize} y={pixelY + gridSize * 4 - wireWidth / 2} x={pixelX} stroke-width='0' stroke='#000' fill='#000000' />
            <rect id='pin_r1' height={wireWidth} width={gridSize} y={pixelY + gridSize * 1 - wireWidth / 2} x={pixelX + gridSize * 4} stroke-width='0' stroke='#000' fill='#000000' />
            <rect id='pin_r2' height={wireWidth} width={gridSize} y={pixelY + gridSize * 2 - wireWidth / 2} x={pixelX + gridSize * 4} stroke-width='0' stroke='#000' fill='#000000' />
            <rect id='pin_r3' height={wireWidth} width={gridSize} y={pixelY + gridSize * 3 - wireWidth / 2} x={pixelX + gridSize * 4} stroke-width='0' stroke='#000' fill='#000000' />
            <rect id='pin_r4' height={wireWidth} width={gridSize} y={pixelY + gridSize * 4 - wireWidth / 2} x={pixelX + gridSize * 4} stroke-width='0' stroke='#000' fill='#000000' />
            <text text-anchor='start' font-family='Noto Sans JP' font-size={24 / 6 * zoom} id='text'
                y={pixelY + 84.41815 / 6 * zoom} x={pixelX + 62.32742 / 6 * zoom} stroke-width='0' stroke='#000' fill='#ffffff'>IC</text>
        </g>
    );
}

// export default Element;
export { Resistor, IC };