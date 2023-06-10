import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useDispatch, useSelector } from 'react-redux';

// Utils
import computeColorRing from '../../../../utils/ColorRing';

// Hooks
import { useFeatureValueGetter, useFeatureUnitGetter, usePinPositionGetter } from '../../hooks/ElementFeatureSelector';

// Components
import Resistor from './Resistor';
import Breadboard from './Breadboard';
import Wire from './Wire';
import Switch from './Switch';
import Capacitor from './Capacitor';
import LED from './LED';
import VoltageSource from './VoltageSource';

function ElementContainer(props) {
    const {
        gridCenter,             // grid坐标系原点在canvas中的像素坐标
        pixelPosSet,            // 每个元件的像素坐标
        onMouseDownOnElement    // 按下时更新canvas中的初始偏移
    } = props;

    const dispatch = useDispatch();
    const { circuit, status, zoom } = useSelector(state => state.editor);
    const getValue = useFeatureValueGetter();
    const getUnit = useFeatureUnitGetter();
    const getPinPos = usePinPositionGetter();

    const gridSize = zoom * 5;

    let breadboards = [], elementList = [];
    for (let id in circuit.elementSet) {
        const { type } = circuit.elementSet[id];
        if (!(id in pixelPosSet)) continue;
        const { x: pixelX, y: pixelY } = pixelPosSet[id].pixelPos;
        switch (type) {
            // case 'capacitor': {
            //     elementList.push(
            //         <g key={id} onMouseDown={(ev) => handleMouseDown(ev, id, pixelX, pixelY)} stroke="null" id="Layer_1" transform={`translate(${pixelX}, ${pixelY - gridSize / 2}) scale(${gridSize * 1 / 50})`}>
            //             <title stroke="null">Layer 1</title>
            //             <line stroke="#000" stroke-width="3" id="svg_1" y2="25" x2="50.0692" y1="25" x1="0" fill="none" />
            //             <ellipse stroke="#000" ry="23" rx="23" id="svg_2" cy="25" cx="25"
            //                 stroke-width="0" fill="#222222" />
            //             <ellipse stroke="#000" ry="18" rx="18" id="svg_3" cy="24.9308" cx="25" stroke-width="0" fill="#BBBBBB" />
            //             <line transform="rotate(-45 24.9654 25.0346)" stroke="#666666" id="svg_6" y2="25.0346" x2="43" y1="25.0346"
            //                 x1="7" fill="#BBBBBB" />
            //             <line transform="rotate(45 24.9654 25.0346)" stroke="#666666" id="svg_7" y2="25.0346" x2="43" y1="25.0346"
            //                 x1="7" fill="#BBBBBB" />
            //         </g>
            //     );
            //     break;
            // }
            case 'resistor': {                
                elementList.push(
                    <Resistor key={id} {...{ id, pixelX, pixelY }} onMouseDown={onMouseDownOnElement} />
                );
                break;
            }
            case 'breadboard': {
                breadboards.push(<Breadboard key={id} {...{ id, pixelX, pixelY }} onMouseDown={onMouseDownOnElement} />);
                break;
            }
            case 'wire': {
                elementList.push(<Wire key={id} {...{ id, pixelX, pixelY }} onMouseDown={onMouseDownOnElement} />)
                break;
            }
            case 'switch': {
                elementList.push(<Switch key={id} {...{ id, pixelX, pixelY }} onMouseDown={onMouseDownOnElement} />);
                break;
            }
            case 'capacitor': {
                elementList.push(<Capacitor key={id} {...{ id, pixelX, pixelY }} onMouseDown={onMouseDownOnElement} />);
                break;
            }
            case 'led': {
                elementList.push(<LED key={id} {...{ id, pixelX, pixelY }} onMouseDown={onMouseDownOnElement} />);
                break;
            }
            case 'source': {
                elementList.push(<VoltageSource key={id} {...{ id, pixelX, pixelY }} onMouseDown={onMouseDownOnElement} />);
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