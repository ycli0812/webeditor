import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import './Canvas.scss';

// Utils

// Components
// import { Resistor } from '../Element';
import Resistor from '../Element/Resistor';
import WithMouseEvent from '../Element/Wrapper';

// Context
import { EditorContext } from '../../utils/EditorContext';

function Canvas(props) {
    const {
        canvasWidth,            // 画布宽度（像素）
        canvasHeight,           // 画布高度（像素）
        elementSet,             // 元件集合
        onUpdateElementSet      // 更新父组件元件集合
    } = props;

    const [zoom, setZoom] = useState(3);
    const gridSize = zoom * 5;
    const [gridX, setGridX] = useState(250); // grid坐标系原点相对canvas的x像素偏移
    const [gridY, setGridY] = useState(250); // grid坐标系原点相对canvas的y像素偏移
    const p = {};
    for(let key in elementSet) {
        p[key] = {
            x: elementSet[key].x * gridSize,
            y: elementSet[key].y * gridSize,
            initOffsetX: 0,
            initOffsetY: 0
        };
    }
    const [piexelPosList, setPixelPosList] = useState(p); // 每个元件相对grid中心的像素坐标

    const editor = useContext(EditorContext);

    // 坐标系位置变化时执行
    useEffect(() => {
        let newPixelSet = {...piexelPosList};
        for(let key in newPixelSet) {
            newPixelSet[key].x = elementSet[key].x * gridSize;
            newPixelSet[key].y = elementSet[key].y * gridSize;
        }
        setPixelPosList(newPixelSet);
        refreashCanvas();
    }, [zoom, gridX, gridY, elementSet]);

    function refreashCanvas() {
        let cvs = document.getElementById('real-canvas');
        if (cvs == null) {
            console.error('Canvas: can not find canvas');
        }
        let context = cvs.getContext('2d');
        // 绘制中心点
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        // context.fillStyle = '#FF0000';
        // context.fillRect(gridX-3, gridY-3, 6, 6);
        // 绘制十字
        context.beginPath();
        context.moveTo(0, gridY - 0.5);
        context.lineTo(canvasWidth, gridY - 0.5);
        context.moveTo(gridX - 0.5, 0);
        context.lineTo(gridX - 0.5, canvasHeight);
        /**
         * Why minus 0.5 px?
         * Ref: https://stackoverflow.com/questions/13879322/drawing-a-1px-thick-line-in-canvas-creates-a-2px-thick-line
        */
        context.lineWidth = 1;
        context.strokeStyle = '#000000';
        context.stroke();
        // 绘制网格点
        let gridSize = zoom * 5;
        let startX = gridX % gridSize;
        let startY = gridY % gridSize;
        context.fillStyle = '#FFBC1D';
        for (var xi = startX; xi <= canvasWidth; xi += gridSize) {
            for (var yi = startY; yi <= canvasHeight; yi += gridSize) {
                context.fillRect(xi - 1, yi - 1, 2, 2);
            }
        }
    }

    function setElementInitOffset(id, x, y) {
        let newSet = {...piexelPosList};
        newSet[id].initOffsetX = x;
        newSet[id].initOffsetY = y;
        setPixelPosList(newSet);
        editor.toggleStatus('draggingComponent', id);
    }

    /**
     * 鼠标按下时触发，设置鼠标按下状态mouseDown为真
     *
     * @param {*} ev 事件实例
     */
    function handleMouseDown(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        let offsetX = ev.nativeEvent.offsetX, offsetY = ev.nativeEvent.offsetY;
        switch(editor.status) {
            case 'default': {
                // default状态下按下鼠标，进入拖拽模式
                editor.toggleStatus('draggingCanvas');
                break;
            }
            case 'adding': {
                // 准备放置元件
                let gridPointerX = Math.floor((offsetX - gridX) / gridSize);
                let gridPointerY = Math.floor((offsetY - gridY) / gridSize);
                let newSet = {...elementSet};
                newSet[editor.targetElementId] = {x: gridPointerX, y: gridPointerY, type: 'resistor', selected: false, active: true};
                let newPixelSet = {...piexelPosList};
                newPixelSet[editor.targetElementId] = {x: gridPointerX * gridX, y: gridPointerY * gridY, initOffsetX: 0, initOffsetY: 0};
                onUpdateElementSet(newSet);
                setPixelPosList(newPixelSet);
                editor.toggleStatus('default');
                break;
            }
            case 'wiring': {
                break;
            }
            default: break;
        }
    }

    /**
     * 鼠标抬起时触发，设置鼠标按下状态为假
     *
     * @param {*} ev 事件实例
     */
    function handleMouseUp(ev) {
        ev.preventDefault();
        let offsetX = ev.nativeEvent.offsetX, offsetY = ev.nativeEvent.offsetY;
        switch(editor.status) {
            case 'draggingComponent': {
                const targetId = editor.targetElementId;
                let newPixelSet = {...piexelPosList}, newElementSet = {...elementSet};
                const curX = newPixelSet[targetId].x, curY = newPixelSet[targetId].y;
                newElementSet[targetId].x = Math.floor(curX / gridSize);
                newElementSet[targetId].y = Math.floor(curY / gridSize);
                newPixelSet[targetId] = {
                    x: newElementSet[targetId].x * gridSize,
                    y: newElementSet[targetId].y * gridSize,
                    initOffsetX: 0,
                    initOffsetY: 0
                };
                onUpdateElementSet(newElementSet);
                setPixelPosList(newPixelSet);
                break;
            }
            default: break;
        }
        editor.toggleStatus('default');
    }

    /**
     * 鼠标滚轮滚动时触发，根据滚动方向更新缩放系数zoom
     *
     * @param {*} ev 事件实例
     */
    function handleMouseWheel(ev) {
        let offsetX = ev.nativeEvent.offsetX, offsetY = ev.nativeEvent.offsetY;
        let deltaY = ev.deltaY;
        let curZoom = zoom;
        if (deltaY < 0) {
            curZoom = curZoom + 1 > 25 ? 25 : curZoom + 1;
        } else {
            curZoom = curZoom - 1 < 1 ? 1 : curZoom - 1;
        }
        setZoom(curZoom);
    }

    /**
     * 鼠标移动时触发，判断按下状态，只有在按下时才会更新虚拟坐标系位置gridX和gridY
     *
     * @param {*} ev 事件实例
     */
    function handleMouseMove(ev) {
        ev.preventDefault();
        let movementX = ev.movementX, movementY = ev.movementY;
        let offsetX = ev.nativeEvent.offsetX, offsetY = ev.nativeEvent.offsetY;
        switch(editor.status) {
            case 'draggingCanvas': {
                setGridX(gridX + movementX);
                setGridY(gridY + movementY);
                break;
            }
            case 'draggingComponent': {
                const target = editor.targetElementId;
                let newSet = {...piexelPosList};
                newSet[target].x = offsetX - gridX - newSet[target].initOffsetX;
                newSet[target].y = offsetY - gridY - newSet[target].initOffsetY;
                setPixelPosList(newSet);
                break;
            }
            case 'wriing': {
                break;
            }
            default: break;
        }
    }

    // 渲染元件组件
    let elementList = [];
    for(let id in elementSet) {
        const {x, y, type, selected, active} = elementSet[id];
        switch(type) {
            case 'resistor': {
                elementList.push(
                    WithMouseEvent(Resistor, {
                        pixelX: piexelPosList[id].x,
                        pixelY: piexelPosList[id].y,
                        id: id,
                        wireWidth: 2,
                        zoom: zoom,
                        gridCenter: {x: gridX, y: gridY},
                        selected: selected,
                        active: active,
                        onMouseDown: setElementInitOffset
                    })
                );
                break;
            }
            default: break;
        }
    }

    return (
        <div id='canvas'>
            <div style={{height: canvasHeight, width: canvasWidth, border: '1px solid #000000'}}>
                <svg
                id='_elements-container_'
                height={canvasHeight}
                width={canvasWidth}
                viewBox={[-gridX, -gridY, canvasWidth, canvasHeight]}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onWheel={handleMouseWheel}
                onMouseMove={handleMouseMove}>
                    {elementList}
                </svg>
                <canvas
                    id='real-canvas'
                    height={canvasHeight}
                    width={canvasWidth}>
                </canvas>    
            </div>
        </div>
    );
}

export default Canvas;