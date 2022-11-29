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
        onMouseDown     // 按下时更新canvas中的初始偏移
    } = props;

    const gridSize = zoom * 5;

    return (
        <g>
            <rect id='body' height={gridSize} width={gridSize * 2} y={pixelY + gridSize / 2} x={pixelX + gridSize} stroke-dasharray='0'
                stroke-width='1' stroke='#8A8365' fill='#EFE4B0' />
            <rect id='wire-right' height={wireWidth} width={gridSize} y={pixelY + gridSize - wireWidth / 2} x={pixelX + 3 * gridSize} stroke-dasharray='5,2,2,2,2,2' stroke-width='0'
                stroke='#000' fill='#000000' />
            <rect id='wire-left' height={wireWidth} width={gridSize} y={pixelY + gridSize - wireWidth / 2} x={pixelX} stroke-dasharray='5,2,2,2,2,2' stroke-width='0'
                stroke='#000' fill='#000000' />
            {/* <text selectable='false' x={pixelX} y={pixelY} fontFamily='Times New Roman'>{id}</text> */}
        </g>
    );
}

export default Resistor;