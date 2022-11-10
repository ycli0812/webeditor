import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import './Element.scss';

// Utils

function Resistor(props) {
    const { 
        gridPos,        // 元件左上角在grid坐标系的坐标（整数）
        zoom,           // 放大倍数，grid边长=zoom*5
        wireWidth,      // 元件引脚处线宽
        id,             // 元件id，也是g标签的id，所有id不会重复
        gridCenter,     // grid坐标系原点在canvas中的像素坐标
        selected,       // 元件是否被选中
        active,         // 元件是否捕获鼠标事件，当有元件被选中时，其他元件将不接收鼠标事件
        onMove,         // 改变元件grid坐标的回调，鼠标抬起时调用
        onSelect        // 被选中时的回调，鼠标按下时调用
    } = props;
    const gridSize = zoom * 5;

    const [pixelX, setPixelX] = useState(gridPos.x * gridSize); // grid坐标系中的像素坐标
    const [pixelY, setPixelY] = useState(gridPos.y * gridSize); // grid坐标系中的像素坐标
    const [initOffset, setInitOffset] = useState({x: 0, y: 0}); // 鼠标按下时指针在元件内部的偏移
    
    useEffect(() => {
        setPixelX(gridPos.x * gridSize);
        setPixelY(gridPos.y * gridSize);
    }, [zoom]);

    /**
     * 用回调将元件状态设置为选中，记录按下时指针对元件左上角的像素偏移
     *
     * @param {*} ev 事件实例
     */
    function handleMouseDown(ev){
        ev.stopPropagation();
        onSelect(id, true);
        setInitOffset({x: ev.nativeEvent.offsetX - gridCenter.x - pixelX, y: ev.nativeEvent.offsetY - gridCenter.y - pixelY});
    }

    /**
     * 根据元件当前的像素坐标计算grid坐标并调用onMove回调将更新的grid坐标传递给父组件
     * 重新计算元件的像素坐标并更新
     *
     * @param {*} ev 事件实例
     */
    function handleMouseUp(ev) {
        let gridX = Math.floor(pixelX / gridSize), gridY = Math.floor(pixelY / gridSize);
        onMove(id, gridX, gridY);
        setPixelX(gridX * gridSize);
        setPixelY(gridY * gridSize);
        onSelect(id, false);
    }

    /**
     * 处理指针在元件内的移动事件，如果指针在元件选中时移动（拖动），更新像素位置
     *
     * @param {*} ev 事件实例
     */
    function handleMouseMove(ev) {
        let movementX = ev.movementX, movementY = ev.movementY;
        if(selected) {
            setPixelX(pixelX + movementX);
            setPixelY(pixelY + movementY);
        }
    }

    /**
     * 指针移出元件时触发，根据记录的初始指针偏移重新设置元件位置
     * 删除这个事件响应不会使拖拽功能完全不能工作，但它可以使拖拽的体验更好
     *
     * @param {*} ev 事件实例
     */
    function handleMouseOut(ev) {
        ev.preventDefault();
        if(selected) {
            let gridOffsetX = ev.nativeEvent.offsetX - gridCenter.x, gridOffsetY = ev.nativeEvent.offsetY - gridCenter.y; // 指针在grid坐标系中的像素坐标
            setPixelX(gridOffsetX - initOffset.x);
            setPixelY(gridOffsetY - initOffset.y);
        }
    }

    return (
        <g
            id={id}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseOut={handleMouseOut}
            opacity={selected ? 0.5 : 1}
            style={{pointerEvents: active ? 'auto' : 'none'}}>
            <rect id='body' height={gridSize * 2} width={gridSize * 4} y={pixelY} x={pixelX + gridSize} stroke-dasharray='2'
                stroke-width='1' stroke='#000' fill='transparent' />
            <rect id='wire-right' height={wireWidth} width={gridSize} y={pixelY + gridSize - wireWidth / 2} x={pixelX + 5 * gridSize} stroke-dasharray='5,2,2,2,2,2' stroke-width='0'
                stroke='#000' fill='#000000' />
            <rect id='wire-left' height={wireWidth} width={gridSize} y={pixelY + gridSize - wireWidth / 2} x={pixelX} stroke-dasharray='5,2,2,2,2,2' stroke-width='0'
                stroke='#000' fill='#000000' />
            <text x={pixelX} y={pixelY}>{id}</text>
        </g>
    );
}


/**
 *
 *
 * @param {*} props
 * @return {*} 
 * @deprecated
 */
function IC(props) {
    const { x, y, zoom, wireWidth } = props;
    const gridSize = zoom * 5;
    const pixelX = x * gridSize, pixelY = y * gridSize;

    return (
        <g id='ic_chip'>
            <title>Layer 1</title>
            <rect stroke-width='0' id='chip' height={gridSize * 5} width={gridSize * 3} y={pixelY} x={pixelX + gridSize} stroke='#000' fill='#666666' />
            <rect id='pin_l1' height={wireWidth} width={gridSize} y={pixelY + gridSize - wireWidth / 2} x={pixelX} stroke-width='0' stroke='#000' fill='#000000' />
            <rect id='pin_l2' height={wireWidth} width={gridSize} y={pixelY + gridSize * 2 - wireWidth / 2} x={pixelX} stroke-width='0' stroke='#000' fill='#000000' />
            <rect id='pin_l3' height={wireWidth} width={gridSize} y={pixelY + gridSize * 3 - wireWidth / 2} x={pixelX} stroke-width='0' stroke='#000' fill='#000000' />
            <rect id='pin_l4' height={wireWidth} width={gridSize} y={pixelY + gridSize * 4 - wireWidth / 2} x={pixelX} stroke-width='0' stroke='#000' fill='#000000' />
            <rect id='pin_r1' height={wireWidth} width={gridSize} y={pixelY + gridSize * 1 - wireWidth / 2} x={pixelX + gridSize * 4} stroke-width='0' stroke='#000' fill='#000000' />
            <rect id='pin_r2' height={wireWidth} width={gridSize} y={pixelY + gridSize * 2 - wireWidth / 2} x={pixelX + gridSize * 4} stroke-width='0' stroke='#000' fill='#000000' />
            <rect id='pin_r3' height={wireWidth} width={gridSize} y={pixelY + gridSize * 3 - wireWidth / 2} x={pixelX + gridSize * 4} stroke-width='0' stroke='#000' fill='#000000' />
            <rect id='pin_r4' height={wireWidth} width={gridSize} y={pixelY + gridSize * 4 - wireWidth / 2} x={pixelX + gridSize * 4} stroke-width='0' stroke='#000' fill='#000000' />
            <text text-anchor='start' font-family='Noto Sans JP' font-size={24 / 6 * zoom} id='text'
                y={pixelY + 84.41815 / 6 * zoom} x={pixelX + 62.32742 / 6 * zoom} stroke-width='0' stroke='#000' fill='#ffffff'>IC</text>
        </g>
    );
}

// export default Element;
export { Resistor, IC };