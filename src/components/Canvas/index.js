import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import './Canvas.scss';

// Utils

// Components
import WithMouseEvent from '../Element/Wrapper';
import Resistor from '../Element/Resistor';
import BreadBoard from '../Element/BreadBoard';

// Context
import { EditorContext } from '../../utils/EditorContext';
import Wire from '../Element/Wire';

function Canvas(props) {
    const {
        canvasWidth,            // 画布宽度（像素）
        canvasHeight            // 画布高度（像素）
    } = props;

    // 使用hook获取Context
    const editor = useContext(EditorContext);

    // 放大系数，最小4，最大20，grid = zoom * 5
    const [zoom, setZoom] = useState(5);
    const gridSize = zoom * 5;
    // grid坐标系原点相对Canvas的偏移
    const [gridX, setGridX] = useState(250);
    const [gridY, setGridY] = useState(250);
    // 维护每个元件的像素位置（Editor全局的元件列表只存储grid坐标）供拖动时改变，拖动完成时才会更新grid坐标
    const p = {};
    for(let key in editor.circuit.elementSet) {
        p[key] = {
            x: editor.circuit.elementSet[key].x * gridSize,
            y: editor.circuit.elementSet[key].y * gridSize + gridY,
            initOffsetX: 0,
            initOffsetY: 0
        };
    }
    const [piexelPosList, setPixelPosList] = useState(p);
    // 记录最近一次鼠标按下后是否移动
    const [moved, setMoved] = useState(false);

    // 坐标系位置变化时执行
    useEffect(() => {
        const p = {};
        for(let key in editor.circuit.elementSet) {
            p[key] = {
                x: editor.circuit.elementSet[key].x * gridSize,
                y: editor.circuit.elementSet[key].y * gridSize,
                initOffsetX: 0,
                initOffsetY: 0
            };
        }
        setPixelPosList(p);
        refreashCanvas();
    }, [zoom, gridX, gridY]);

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

    function findNearestGridPoint(offsetX, offsetY) {
        // TODO: 判断最近的点
        let x = Math.floor((offsetX - gridX) / gridSize);
        let y = Math.floor((offsetY - gridY) / gridSize);
        return {x: x, y: y};
    }

    function setElementInitOffset(id, x, y) {
        if(editor.status == 'wiring') return;
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
        setMoved(false);
        let offsetX = ev.nativeEvent.offsetX, offsetY = ev.nativeEvent.offsetY;
        switch(editor.status) {
            case 'default': {
                // default状态下按下鼠标，进入拖拽模式
                editor.toggleStatus('draggingCanvas');
                break;
            }
            case 'adding': {
                // 计算位置
                const { x, y } = findNearestGridPoint(offsetX, offsetY);
                // 更新像素坐标   
                let newPixelSet = {...piexelPosList};
                newPixelSet[editor.targetElementId] = {
                    x: x * gridSize,
                    y: y * gridSize,
                    initOffsetX: 0,
                    initOffsetY: 0
                };
                setPixelPosList(newPixelSet);
                // 添加元件
                editor.addElement(editor.targetElementId, 'resistor', x, y, []);
                // 更新状态
                editor.toggleStatus('default');
                break;
            }
            case 'wiring': {
                if(editor.anchorPoint == null) {
                    editor.setAnchorPoint(findNearestGridPoint(offsetX, offsetY));
                    console.log('set first point');
                } else {
                    const pCur = findNearestGridPoint(offsetX, offsetY);
                    editor.addLine(editor.anchorPoint, pCur);
                    editor.setAnchorPoint(null);
                    editor.toggleStatus('default');
                    console.log('set second point');
                }
                break;
            }
            default: break;
        }
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
                setMoved(true);
                break;
            }
            case 'draggingComponent': {
                const target = editor.targetElementId;
                let newSet = {...piexelPosList};
                newSet[target].x = offsetX - gridX - newSet[target].initOffsetX;
                newSet[target].y = offsetY - gridY - newSet[target].initOffsetY;
                setPixelPosList(newSet);
                setMoved(true);
                break;
            }
            case 'wiring': {
                break;
            }
            case 'adding': {
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
                const { initOffsetX, initOffsetY } = piexelPosList[targetId];
                let { x, y } = findNearestGridPoint(offsetX - initOffsetX, offsetY - initOffsetY);
                // 更新像素坐标   
                let newPixelSet = {...piexelPosList};
                newPixelSet[targetId] = {
                    x: x * gridSize,
                    y: y * gridSize,
                    initOffsetX: 0,
                    initOffsetY: 0
                };
                setPixelPosList(newPixelSet);
                // 更新Context中的列表
                editor.setElementPos(targetId, x, y);
                // 如果moved为假，说明是点击而不是拖动
                editor.setSelectedList([targetId]);
                // 更新状态
                editor.toggleStatus('default');
                break;
            }
            case 'draggingCanvas': {
                // 更新状态
                editor.toggleStatus('default');
                // 如果按下后没有移动，清除所有选中
                if(!moved) {
                    editor.setSelectedList([]);
                }
                break;
            }
            default: break;
        }
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
            curZoom = curZoom + 1 > 20 ? 20 : curZoom + 1;
        } else {
            curZoom = curZoom - 1 < 4 ? 4 : curZoom - 1;
        }
        setZoom(curZoom);
    }

    // 渲染元件组件
    let elementList = [];
    let breadboard;
    for(let id in editor.circuit.elementSet) {
        const { x, y, type, selected, features } = editor.circuit.elementSet[id];
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
                        features: features,
                        onMouseDown: setElementInitOffset
                    })
                );
                break;
            }
            case 'breadboard': {
                breadboard = WithMouseEvent(BreadBoard, {
                    pixelX: piexelPosList[id].x,
                    pixelY: piexelPosList[id].y,
                    id: id,
                    wireWidth: 2,
                    zoom: zoom,
                    gridCenter: {x: gridX, y: gridY},
                    selected: selected,
                    features: features,
                    onMouseDown: setElementInitOffset
                });
                break;
            }
            default: break;
        }
    }

    // 渲染连线
    let lines = [];
    const linesModel = editor.circuit.connection;
    for(let i in linesModel) {
        lines.push(
            <Wire zoom={zoom} x1={linesModel[i].start.x} y1={linesModel[i].start.y} x2={linesModel[i].end.x} y2={linesModel[i].end.y}/>
        );
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
                    {breadboard}
                    {elementList}
                    {lines}
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