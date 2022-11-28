import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

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

    return (
        <g>
            <rect id='body' height={gridSize * 2} width={gridSize * 4} y={pixelY} x={pixelX + gridSize} stroke-dasharray='2'
                stroke-width='1' stroke='#000' fill='transparent' />
            <rect id='wire-right' height={wireWidth} width={gridSize} y={pixelY + gridSize - wireWidth / 2} x={pixelX + 5 * gridSize} stroke-dasharray='5,2,2,2,2,2' stroke-width='0'
                stroke='#000' fill='#000000' />
            <rect id='wire-left' height={wireWidth} width={gridSize} y={pixelY + gridSize - wireWidth / 2} x={pixelX} stroke-dasharray='5,2,2,2,2,2' stroke-width='0'
                stroke='#000' fill='#000000' />
            <text selectable='false' x={pixelX} y={pixelY} fontFamily='Times New Roman'>{id}</text>
        </g>
    );
}

export default Resistor;