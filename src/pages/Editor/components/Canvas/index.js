import React, { useState, useEffect, useContext, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Style
import canvasStyle from './Canvas.module.css';

// Utils
import { generateTypeId } from '../../../../utils/IdGenerator';

// Components
import ElementContainer from '../ElementContainer/index';

// Redux actions
import { addElement, addDraftElement, setElementInfo, clearSelect, selectElement, setAnchorPoint, setEditorStatus, setTragetElement, moveElement } from '../../slices/editorSlice';
import { zoomIn, zoomOut, setGridCenter } from '../../slices/editorSlice';

// Antd Components
import { Alert, Modal, Button } from 'antd';

// Hooks
import useElementAdder from '../../hooks/ElementAdder';
import useCanvasViewbox from '../../hooks/CnvasViewboxHook';

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
    // const addWire = useElementAdder('wire');
    const adder = useElementAdder();

    const viewbox = useCanvasViewbox(canvasHeight, canvasWidth);

    const navigate = useNavigate();

    // 坐标系位置变化时执行
    useEffect(() => {
        refreashClient();
        refreashCanvas();
    }, [zoom, gridX, gridY, circuit, canvasHeight, canvasWidth]);

    const canvasRef = useRef(null);
    useEffect(() => {
        switch(status) {
            case 'draggingComponent':
            case 'draggingCanvas': { canvasRef.current.style.cursor = 'move'; break; }
            case 'adding':
            case 'wiring': { canvasRef.current.style.cursor = 'crosshair'; break; }
            default: { canvasRef.current.style.cursor = 'default'; break; }
        }

        return () => {
            document.body.style.cursor = 'default';
        };
    }, [status]);

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
                pixelPos: { x: x * 100, y: y * 100 },
                initOffset: { x: 0, y: 0 },
                selected: false
            }
        }
        setPixelPosList(updated);
    }

    function findNearestGridPoint(offsetX, offsetY) {
        const svgOffsetX = (offsetX - gridX) / (zoom * 5) * 100;
        const svgOffsetY = (offsetY - gridY) / (zoom * 5) * 100;
        let x = Math.floor(svgOffsetX / 100);
        let y = Math.floor(svgOffsetY / 100);
        let dx = svgOffsetX - x * 100, dy = svgOffsetY - y * 100;
        return {
            x: dx > 100 / 2 ? (x + 1) : x,
            y: dy > 100 / 2 ? (y + 1) : y
        };
    }

    function onMouseDownOnElement(id, x, y) {
        if (status === 'wiring' || status === 'adding') return;
        let newSet = { ...piexelPosList };
        newSet[id].initOffset = { x, y };
        setPixelPosList(newSet);
        dispatch(setEditorStatus('draggingComponent'));
        dispatch(setTragetElement({ id }));
    }

    function handleMouseDown(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        setMoved(false);
        let { offsetX, offsetY } = ev.nativeEvent;
        // console.log(ev);
        switch (status) {
            case 'default': {
                // default状态下按下鼠标，进入拖拽模式
                dispatch(setEditorStatus('draggingCanvas'));
                break;
            }
            case 'adding': {
                const { x, y } = findNearestGridPoint(offsetX, offsetY);
                // if (addResistor(x, y)) dispatch(setEditorStatus('default'));
                if (adder(targetElement.type, x, y)) dispatch(setEditorStatus('default'));
                break;
            }
            // case 'wiring': {
            //     const { x, y } = findNearestGridPoint(offsetX, offsetY);
            //     if (addWire(x, y)) dispatch(setEditorStatus('default'));
            //     break;
            // }
            default: break;
        }
    }

    function handleMouseMove(ev) {
        ev.preventDefault();
        const { movementX, movementY } = ev;
        const { offsetX, offsetY } = ev.nativeEvent;
        switch (status) {
            case 'draggingCanvas': {
                dispatch(setGridCenter(gridX + movementX, gridY + movementY));
                setMoved(true);
                break;
            }
            case 'draggingComponent': {
                const target = targetElement.id;
                let updated = { ...piexelPosList };
                const newX = (offsetX - gridX - updated[target].initOffset.x) / (zoom * 5) * 100;
                const newY = (offsetY - gridY - updated[target].initOffset.y) / (zoom * 5) * 100;
                updated[target].pixelPos = {
                    x: newX,
                    y: newY
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
                console.log('mouseup:', x, y);
                // 更新像素坐标   
                let newPixelSet = { ...piexelPosList };
                newPixelSet[targetId] = {
                    pixelPos: { x: x * 100, y: y * 100 },
                    initOffset: { x: 0, y: 0 },
                    selected: false
                };
                setPixelPosList(newPixelSet);
                // dispatch(setElementInfo({ id: targetId, x, y }));
                dispatch(moveElement(targetId, x, y));
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
        <div id={canvasStyle.canvas} style={{ height: canvasHeight, width: '100%' }} ref={canvasRef}>
            <svg
                id={canvasStyle.elementsContainer}
                height={canvasHeight}
                // height={canvasRef.current.clientWidth}
                width={canvasWidth}
                // viewBox={[-gridX, -gridY, canvasWidth, canvasHeight]}
                viewBox={viewbox}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onWheel={handleMouseWheel}
                onMouseMove={handleMouseMove}>
                {/* <rect x={100} y={100} height={100} width={100} /> */}
                <ElementContainer
                    zoom={zoom}
                    pixelPosSet={piexelPosList}
                    onMouseDownOnElement={onMouseDownOnElement} />
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