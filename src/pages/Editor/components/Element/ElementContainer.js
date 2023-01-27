import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Context
import { EditorContext } from '../../../../utils/Context';

// Utils
import computeColorRing from '../../../../utils/ColorRing';

// Hooks
// function useWireFeatures(features) {
//     let x1, y1, x2, y2, hexColor;
//     for(let i in features) {
//         switch(features[i].name) {
//             case 'x1': {
//                 x1 = features[i].value;
//                 break;
//             }
//             case 'x2': {}
//             case 'y1': {}
//             case 'y2': {}
//             case 'color': {}
//             default: break;
//         }
//     }
// }

function ElementContainer(props) {
    const {
        zoom,           // 放大倍数，grid边长=zoom*5
        wireWidth,      // 元件引脚处线宽
        gridCenter,     // grid坐标系原点在canvas中的像素坐标
        clientStatus,   // 每个元件的像素坐标
        onMouseDown     // 按下时更新canvas中的初始偏移
    } = props;

    const editor = useContext(EditorContext);

    const gridSize = zoom * 5;

    function handleMouseDown(ev, id, x, y) {
        if (editor.status == 'default') {
            ev.stopPropagation();
            onMouseDown(id, ev.nativeEvent.offsetX - gridCenter.x - x, ev.nativeEvent.offsetY - gridCenter.y - y);
        }
    }

    let breadboards = [], elementList = [];
    for (let id in editor.circuit.elementSet) {
        const { type, features } = editor.circuit.elementSet[id];
        if (!clientStatus[id]) continue;
        const { x: pixelX, y: pixelY } = clientStatus[id].pixelPos;
        switch (type) {
            case 'resistor': {
                const rings = computeColorRing(features[0].value, features[0].unit, features[1].value);
                elementList.push(
                    <g key={id} onMouseDown={(ev) => handleMouseDown(ev, id, pixelX, pixelY)}>
                        <rect id='body' height={gridSize} width={gridSize * 2} y={pixelY + gridSize / 2} x={pixelX + gridSize} strokeWidth='1' stroke='#8A8365' fill='#EFE4B0' />
                        <rect id='wire-right' height={wireWidth} width={gridSize} y={pixelY + gridSize - wireWidth / 2} x={pixelX + 3 * gridSize} strokeWidth='0'
                            stroke='#000' fill='#000000' />
                        <rect id='wire-left' height={wireWidth} width={gridSize} y={pixelY + gridSize - wireWidth / 2} x={pixelX} strokeWidth='0'
                            stroke='#000' fill='#000000' />
                        <rect id='ring1' height={gridSize} width={gridSize * 0.2} y={pixelY + gridSize / 2} x={pixelX + gridSize + gridSize * 0.2} fill={rings[0]} />
                        <rect id='ring2' height={gridSize} width={gridSize * 0.2} y={pixelY + gridSize / 2} x={pixelX + gridSize + gridSize * 0.5} fill={rings[1]} />
                        <rect id='ring3' height={gridSize} width={gridSize * 0.2} y={pixelY + gridSize / 2} x={pixelX + gridSize + gridSize * 0.8} fill={rings[2]} />
                        <rect id='ring4' height={gridSize} width={gridSize * 0.2} y={pixelY + gridSize / 2} x={pixelX + gridSize + gridSize * 1.1} fill={rings[3]} />
                        <rect id='ring5' height={gridSize} width={gridSize * 0.2} y={pixelY + gridSize / 2} x={pixelX + gridSize * 3 - gridSize * 0.4} fill={rings[4]} />
                    </g>
                );
                break;
            }
            case 'breadboard': {
                const cols = features[0].value;
                const holes = [];
                const holeSize = zoom * 2;
                for (let b = 0; b < 2; b++) {
                    for (let m = 0; m < 5; m++) {
                        for (let n = 0; n < cols; n++) {
                            holes.push(
                                <rect
                                    key={cols * 5 * b + m * cols + n}
                                    id={'svg_' + m * n}
                                    height={holeSize}
                                    width={holeSize}
                                    y={pixelY + gridSize - holeSize / 2 + b * 6 * gridSize + m * gridSize}
                                    x={pixelX + gridSize - holeSize / 2 + n * gridSize}
                                    stroke='#000'
                                    fill='#777777' />
                            );
                        }
                    }
                }
                breadboards.push(
                    <g onMouseDown={(ev) => handleMouseDown(ev, id, pixelX, pixelY)} key={id}>
                        <rect id='svg_1' x={pixelX} y={pixelY} height={12 * gridSize} width={(cols + 1) * gridSize} strokeWidth='0' stroke='#000' fill='#EEEEEE' />
                        {holes}
                    </g>
                );
                break;
            }
            case 'wire': {
                const [
                    { value: x1 } = { value: 0 },
                    { value: y1 } = { value: 0 },
                    { value: x2 } = { value: 0 },
                    { value: y2 } = { value: 0 },
                    { value: hexColor } = { value: '#000000' }
                ] = features;
                elementList.push(
                    <g key={id} onMouseDown={(ev) => handleMouseDown(ev, id, pixelX, pixelY)}>
                        <line x1={x1 * gridSize} y1={y1 * gridSize} x2={x2 * gridSize} y2={y2 * gridSize} stroke={hexColor} strokeWidth={4}></line>
                    </g>
                );
                break;
            }
            default: break;
        }
    }

    return (
        <g>
            {breadboards}
            {elementList}
        </g>
    );
}

export default ElementContainer;