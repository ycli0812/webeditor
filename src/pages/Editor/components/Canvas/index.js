import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useDispatch, useSelector } from 'react-redux';

// Style
import canvasStyle from './Canvas.module.css';

// Utils
import { generateTypeId } from '../../../../utils/IdGenerator';

// Components
import ElementContainer from '../Element/ElementContainer';

// Redux actions
import { addElement, addDraftElement, setElementInfo, clearSelect, selectElement, setAnchorPoint, setEditorStatus, setTragetElement } from '../../slices/editorSlice';
import { zoomIn, zoomOut, setGridCenter } from '../../slices/editorSlice';

// Hooks
// import useElementAdder from '../../hooks/ElementAdder';
import useElementAdder from '../../hooks/ElementAdder';

function Canvas(props) {
    const {
        canvasWidth,            // 画布宽度（像素）
        canvasHeight            // 画布高度（像素）
    } = props;

    // 使用hook获取Context
    // const editor = useContext(EditorContext);

    // 放大系数，最小4，最大20，grid = zoom * 5
    // const [zoom, setZoom] = useState(5);
    const { zoom, gridX, gridY } = useSelector(state => state.editor);
    const gridSize = zoom * 5;
    // grid坐标系原点相对Canvas的偏移
    // const [gridX, setGridX] = useState(250);
    // const [gridY, setGridY] = useState(250);
    // 维护每个元件的像素位置（Editor全局的元件列表只存储grid坐标）供拖动时改变，拖动完成时才会更新grid坐标
    const [piexelPosList, setPixelPosList] = useState({});
    // 记录最近一次鼠标按下后是否移动
    const [moved, setMoved] = useState(false);

    const dispatch = useDispatch();
    const { circuit, status, target: targetElement, anchorPoint } = useSelector(state => state.editor);

    // Elements adder
    // const add = useElementAdder();
    const addResistor = useElementAdder('resistor');
    const addWire = useElementAdder('wire');

    // 坐标系位置变化时执行
    useEffect(() => {
        refreashClient();
        refreashCanvas();
    }, [zoom, gridX, gridY, circuit]);

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
        for (let id in circuit.elementSet) {
            const { x, y } = circuit.elementSet[id];
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
        if (status == 'wiring') return;
        let newSet = { ...piexelPosList };
        newSet[id].initOffset = { x, y };
        // newSet[id].initOffsetX = x;
        // newSet[id].initOffsetY = y;
        setPixelPosList(newSet);
        dispatch(setEditorStatus('draggingComponent'));
        dispatch(setTragetElement({ id }));
    }

    function handleMouseDown(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        setMoved(false);
        let { offsetX, offsetY } = ev.nativeEvent;
        console.log(ev);
        switch (status) {
            case 'default': {
                // default状态下按下鼠标，进入拖拽模式
                dispatch(setEditorStatus('draggingCanvas'));
                break;
            }
            case 'adding': {
                // // 计算位置
                const { x, y } = findNearestGridPoint(offsetX, offsetY);
                if(addResistor(x, y)) dispatch(setEditorStatus('default'));
                break;
            }
            case 'wiring': {
                const {x, y} = findNearestGridPoint(offsetX, offsetY);
                if(addWire(x, y)) dispatch(setEditorStatus('default'));
                break;
            }
            default: break;
        }
    }

    function handleMouseMove(ev) {
        ev.preventDefault();
        const { movementX, movementY } = ev;
        const { offsetX, offsetY } = ev.nativeEvent;
        switch (status) {
            case 'draggingCanvas': {
                // setGridX(gridX + movementX);
                // setGridY(gridY + movementY);
                dispatch(setGridCenter(gridX + movementX, gridY + movementY));
                setMoved(true);
                break;
            }
            case 'draggingComponent': {
                const target = targetElement.id;
                let updated = { ...piexelPosList };
                updated[target].pixelPos = {
                    x: offsetX - gridX - updated[target].initOffset.x,
                    y: offsetY - gridY - updated[target].initOffset.y
                };
                setPixelPosList(updated);
                setMoved(true);
                break;
            }
            default: break;
        }
    }

    function handleMouseUp(ev) {
        ev.preventDefault();
        let { offsetX, offsetY } = ev.nativeEvent;
        switch (status) {
            case 'draggingComponent': {
                const targetId = targetElement.id;
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
                dispatch(setElementInfo({ id: targetId, pos: { x, y } }));
                if (!moved) {
                    dispatch(clearSelect());
                    dispatch(selectElement(targetId));
                }
                dispatch(setEditorStatus('default'));
                break;
            }
            case 'draggingCanvas': {
                // 更新状态
                dispatch(setEditorStatus('default'));
                // 如果按下后没有移动，清除所有选中
                if (!moved) {
                    dispatch(clearSelect());
                }
                break;
            }
            default: break;

        }
        setMoved(false);
    }

    function handleMouseWheel(ev) {
        const { deltaY } = ev;
        if (deltaY < 0) {
            dispatch(zoomIn());
        } else {
            dispatch(zoomOut());
        }
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