import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import './Canvas.scss';

// Utils

// Components
import { Resistor } from '../Element';

function Canvas(props) {
    const {
        canvasWidth,            // 画布宽度（像素）
        canvasHeight,           // 画布高度（像素）
        elementSet,             // 元件集合
        pointerStatus,          // 光标状态，Canvas只需要判断是否正在进行Canvas之外的操作
        onPointerStatusChange,  // 改变父组件中的光标状态
        onUpdateElementSet      // 更新父组件元件集合
    } = props;

    const [zoom, setZoom] = useState(3);
    const [gridX, setGridX] = useState(250); // grid坐标系原点相对canvas的x像素偏移
    const [gridY, setGridY] = useState(250); // grid坐标系原点相对canvas的y像素偏移
    const [mouseDown, setMouseDown] = useState(false);

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

    // 坐标系位置变化时执行
    useEffect(() => {
        // console.log('Canvas: redraw')
        refreashCanvas();
    }, [zoom, gridX, gridY, elementSet]);

    /**
     * 鼠标按下时触发，设置鼠标按下状态mouseDown为真
     *
     * @param {*} ev 事件实例
     */
    function handleMouseDown(ev) {
        ev.preventDefault();
        let offsetX = ev.nativeEvent.offsetX, offsetY = ev.nativeEvent.offsetY;
        setMouseDown(true);
        console.log('Canvas: mouse down:', ev.target);
    }

    /**
     * 鼠标抬起时触发，设置鼠标按下状态为假
     *
     * @param {*} ev 事件实例
     */
    function handleMouseUp(ev) {
        ev.preventDefault();
        let offsetX = ev.nativeEvent.offsetX, offsetY = ev.nativeEvent.offsetY;
        setMouseDown(false);
        // console.log('Canvas: mouse up:', offsetX, offsetY);
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
        // console.log('Canvas: mouse scroll:', offsetX, offsetY, deltaY < 0 ? 'up' : 'down');
    }

    /**
     * 鼠标移动时触发，判断按下状态，只有在按下时才会更新虚拟坐标系位置gridX和gridY
     *
     * @param {*} ev 事件实例
     */
    function handleMouseMove(ev) {
        ev.preventDefault();
        let movementX = ev.movementX, movementY = ev.movementY;
        if (mouseDown) {
            setGridX(gridX + movementX);
            setGridY(gridY + movementY);
            // console.log('Canvas: mouse move:', movementX, movementY);
        }
    }

    /**
     * 元件位置改变的回调
     *
     * @param {*} id 元件id
     * @param {*} x grid坐标x
     * @param {*} y grid坐标y
     */
    function setCoordinate(id, x, y) {
        if(elementSet[id] == null) {
            console.error('Canvas: can not find element', id);
            return;
        }
        let updatedElementSet = {...elementSet};
        updatedElementSet[id].x = x;
        updatedElementSet[id].y = y;
        onUpdateElementSet(updatedElementSet);
    }

    function handleElementSelect(id, state) {
        if(elementSet[id] == null) {
            console.error('Canvas: can not find element', id);
            return;
        }
        let updatedElementSet = {...elementSet};
        for(let key in updatedElementSet) {
            updatedElementSet[key].active = state ? false : true;
        }
        updatedElementSet[id].selected = state;
        updatedElementSet[id].active = true;
        onUpdateElementSet(updatedElementSet);
    }

    // 渲染元件组件
    let elementList = [];
    for(let id in elementSet) {
        const {x, y, type, selected, active} = elementSet[id];
        switch(type) {
            case 'resistor': {
                elementList.push(
                    <Resistor
                        gridPos={{x: x, y: y}}
                        id={id}
                        wireWidth={2}
                        zoom={zoom}
                        gridCenter={{x: gridX, y: gridY}}
                        selected={selected}
                        active={active}
                        onMove={setCoordinate}
                        onSelect={handleElementSelect}
                    />
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
                    id='elements-container'
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