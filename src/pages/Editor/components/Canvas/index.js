import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import canvasStyle from './Canvas.module.css';

// Utils

// Components
import ElementContainer from '../Element/ElementContainer';
import WireContainer from '../Element/WireContainer';

// Context
import { EditorContext } from '../../../../utils/Context';

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
    const [piexelPosList, setPixelPosList] = useState({});
    // 记录最近一次鼠标按下后是否移动
    const [moved, setMoved] = useState(false);

    // 坐标系位置变化时执行
    useEffect(() => {
        refreashClient();
        refreashCanvas();
    }, [zoom, gridX, gridY, editor.circuit]);

    function refreashCanvas() {
        let cvs = document.getElementById(canvasStyle.realCanvas);
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

    function refreashClient() {
        let updated = {};
        for (let id in editor.circuit.elementSet) {
            const { x, y } = editor.circuit.elementSet[id];
            updated[id] = {
                pixelPos: { x: x * gridSize, y: y * gridSize },
                initOffset: { x: 0, y: 0 },
                selected: false
            }
        }
        setPixelPosList(updated);
    }

    function findNearestGridPoint(offsetX, offsetY) {
        let x = Math.floor((offsetX - gridX) / gridSize);
        let y = Math.floor((offsetY - gridY) / gridSize);
        let dx = offsetX - gridX - x * gridSize, dy = offsetY - gridY - y * gridSize;
        return {
            x: dx > gridSize / 2 ? (x + 1) : x,
            y: dy > gridSize / 2 ? (y + 1) : y
        };
    }

    function onMouseDownOnElement(id, x, y) {
        if (editor.status == 'wiring') return;
        let newSet = { ...piexelPosList };
        newSet[id].initOffset = { x, y };
        // newSet[id].initOffsetX = x;
        // newSet[id].initOffsetY = y;
        setPixelPosList(newSet);
        editor.toggleStatus({
            status: 'draggingComponent',
            targetId: id
        });
    }

    function handleMouseDown(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        setMoved(false);
        let offsetX = ev.nativeEvent.offsetX, offsetY = ev.nativeEvent.offsetY;
        switch (editor.status) {
            case 'default': {
                // default状态下按下鼠标，进入拖拽模式
                editor.toggleStatus({
                    status: 'draggingCanvas'
                });
                break;
            }
            case 'adding': {
                // 计算位置
                const { x, y } = findNearestGridPoint(offsetX, offsetY);
                // 更新像素坐标   
                let newPixelSet = { ...piexelPosList };
                newPixelSet[editor.targetElementId] = {
                    pixelPos: { x: x * gridSize, y: y * gridSize },
                    initOffset: { x: 0, y: 0 }
                };
                setPixelPosList(newPixelSet);
                // 添加元件
                // editor.addElement(editor.targetElementId, 'resistor', x, y, [
                //     { name: 'resistace', value: 1, unit: 'om' },
                //     { name: 'tolerance', value: '1%' }
                // ]);
                // console.log('to add:', editor.targetElementId, editor.targetFeature);
                editor.addElement(editor.targetElementId, editor.targetElementType, x, y, editor.targetFeature);
                // 更新状态
                editor.toggleStatus({
                    status: 'default'
                });
                break;
            }
            case 'wiring': {
                if (editor.anchorPoint == null) {
                    editor.setAnchorPoint(findNearestGridPoint(offsetX, offsetY));
                    console.log('set first point');
                } else {
                    const pCur = findNearestGridPoint(offsetX, offsetY);
                    editor.addLine(editor.anchorPoint, pCur);
                    editor.setAnchorPoint(null);
                    editor.toggleStatus({
                        status: 'default'
                    });
                    console.log('set second point');
                }
                break;
            }
            default: break;
        }
    }

    function handleMouseMove(ev) {
        ev.preventDefault();
        let movementX = ev.movementX, movementY = ev.movementY;
        let offsetX = ev.nativeEvent.offsetX, offsetY = ev.nativeEvent.offsetY;
        switch (editor.status) {
            case 'draggingCanvas': {
                setGridX(gridX + movementX);
                setGridY(gridY + movementY);
                setMoved(true);
                break;
            }
            case 'draggingComponent': {
                const target = editor.targetElementId;
                let updated = { ...piexelPosList };
                updated[target].pixelPos = {
                    x: offsetX - gridX - updated[target].initOffset.x,
                    y: offsetY - gridY - updated[target].initOffset.y
                };
                setPixelPosList(updated);
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

    function handleMouseUp(ev) {
        ev.preventDefault();
        let offsetX = ev.nativeEvent.offsetX, offsetY = ev.nativeEvent.offsetY;
        switch (editor.status) {
            case 'draggingComponent': {
                const targetId = editor.targetElementId;
                const { x: initOffsetX, y: initOffsetY } = piexelPosList[targetId].initOffset;
                let { x, y } = findNearestGridPoint(offsetX - initOffsetX, offsetY - initOffsetY);
                // 更新像素坐标   
                let newPixelSet = { ...piexelPosList };
                newPixelSet[targetId] = {
                    pixelPos: { x: x * gridSize, y: y * gridSize },
                    initOffset: { x: 0, y: 0 },
                    selected: false
                };
                setPixelPosList(newPixelSet);
                // 更新Context中的列表
                editor.setElementPos(targetId, x, y);
                // 如果moved为假，说明是点击而不是拖动
                editor.setSelectedList([targetId]);
                // 更新状态
                editor.toggleStatus({
                    status: 'default'
                });
                break;
            }
            case 'draggingCanvas': {
                // 更新状态
                editor.toggleStatus({
                    status: 'default'
                });
                // 如果按下后没有移动，清除所有选中
                if (!moved) {
                    editor.setSelectedList([]);
                }
                break;
            }
            default: break;
        }
    }

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

    return (
        <div id={canvasStyle.canvas} style={{ height: canvasHeight, width: canvasWidth }}>
            <svg
                id={canvasStyle.elementsContainer}
                height={canvasHeight}
                width={canvasWidth}
                viewBox={[-gridX, -gridY, canvasWidth, canvasHeight]}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onWheel={handleMouseWheel}
                onMouseMove={handleMouseMove}>
                <ElementContainer
                    zoom={zoom}
                    wireWidth={2}
                    gridCenter={{ x: gridX, y: gridY }}
                    clientStatus={piexelPosList}
                    onMouseDown={onMouseDownOnElement} />
            </svg>
            <canvas
                id={canvasStyle.realCanvas}
                height={canvasHeight}
                width={canvasWidth}>
            </canvas>
        </div>
    );
}

export default Canvas;