import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

function BreadBoard(props) {
    const {
        pixelX,         // 元件相对canvas的像素坐标x
        pixelY,         // 元件相对canvas的像素坐标y
        zoom,           // 放大倍数，grid边长=zoom*5
        wireWidth,      // 元件引脚处线宽
        id,             // 元件id，也是g标签的id，所有id不会重复
        gridCenter,     // grid坐标系原点在canvas中的像素坐标
        selected,       // 元件是否被选中
        features        // 属性
    } = props;

    const gridSize = zoom * 5;
    const holeSize = zoom * 2;

    const cols = features[0].value;

    const holes = [];
    for(let b=0; b<2; b++) {
        for(let m=0; m<5; m++) {
            for(let n=0; n<cols; n++) {
                holes.push(
                    <rect
                    id={'svg_' + m * n}
                    height={holeSize}
                    width={holeSize}
                    y={pixelY + gridSize - holeSize / 2 + b * 6 * gridSize + m * gridSize}
                    x={pixelX + gridSize - holeSize / 2 + n * gridSize}
                    stroke-opacity='null'
                    stroke-width='0'
                    stroke='#000'
                    fill='#777777' />
                );
            }
        }
    }
    

    return (
        <g>
            <rect id='svg_1' x={pixelX} y={pixelY} height={12 * gridSize} width={(cols + 1) * gridSize} stroke-width='0' stroke='#000' fill='#EEEEEE' />
            {holes}
        </g>
    );
}

export default BreadBoard;