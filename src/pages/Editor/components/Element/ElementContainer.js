import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useDispatch, useSelector } from 'react-redux';

// Utils
import computeColorRing from '../../../../utils/ColorRing';

// Hooks
import { useFeatureValueGetter, useFeatureUnitGetter } from '../../hooks/ElementFeatureSelector';

function ElementContainer(props) {
    const {
        zoom,           // 放大倍数，grid边长=zoom*5
        wireWidth,      // 元件引脚处线宽
        gridCenter,     // grid坐标系原点在canvas中的像素坐标
        clientStatus,   // 每个元件的像素坐标
        onMouseDown     // 按下时更新canvas中的初始偏移
    } = props;

    const dispatch = useDispatch();
    const { circuit, status } = useSelector(state => state.editor);
    const getValue = useFeatureValueGetter();
    const getUnit = useFeatureUnitGetter();

    const gridSize = zoom * 5;

    function handleMouseDown(ev, id, x, y) {
        if (status == 'default') {
            ev.stopPropagation();
            onMouseDown(id, ev.nativeEvent.offsetX - gridCenter.x - x, ev.nativeEvent.offsetY - gridCenter.y - y);
        }
    }

    let breadboards = [], elementList = [];
    for (let id in circuit.elementSet) {
        const { type, features } = circuit.elementSet[id];
        if (!clientStatus[id]) continue;
        const { x: pixelX, y: pixelY } = clientStatus[id].pixelPos;
        switch (type) {
            case 'capacitor': {
                elementList.push(
                    <g key={id} onMouseDown={(ev) => handleMouseDown(ev, id, pixelX, pixelY)} stroke="null" id="Layer_1" transform={`translate(${pixelX}, ${pixelY-gridSize/2}) scale(${gridSize*1/50})`}>
                        <title stroke="null">Layer 1</title>
                        <line stroke="#000" stroke-width="3" id="svg_1" y2="25" x2="50.0692" y1="25" x1="0" fill="none" />
                        <ellipse stroke="#000" ry="23" rx="23" id="svg_2" cy="25" cx="25"
                            stroke-width="0" fill="#222222" />
                        <ellipse stroke="#000" ry="18" rx="18" id="svg_3" cy="24.9308" cx="25" stroke-width="0" fill="#BBBBBB" />
                        <line transform="rotate(-45 24.9654 25.0346)" stroke="#666666" id="svg_6" y2="25.0346" x2="43" y1="25.0346"
                            x1="7" fill="#BBBBBB" />
                        <line transform="rotate(45 24.9654 25.0346)" stroke="#666666" id="svg_7" y2="25.0346" x2="43" y1="25.0346"
                            x1="7" fill="#BBBBBB" />
                    </g>
                );
                break;
            }
            case 'resistor': {
                const rings = computeColorRing(getValue('resistance', id), getUnit('resistance', id), getValue('tolerance', id));
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
                const cols = getValue('column', id);
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
                const x1 = getValue('x1', id), x2 = getValue('x2', id), y1 = getValue('y1', id), y2 = getValue('y2', id), hexColor = getValue('color', id);
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