import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import './Element.scss';

// Context
import { EditorContext } from '../../utils/EditorContext';

function WithMouseEvent(Wrapped, props) {
    const { 
        pixelX,         // 元件相对canvas的像素坐标x
        pixelY,         // 元件相对canvas的像素坐标y
        zoom,           // 放大倍数，grid边长=zoom*5
        wireWidth,      // 元件引脚处线宽
        id,             // 元件id，也是g标签的id，所有id不会重复
        gridCenter,     // grid坐标系原点在canvas中的像素坐标
        selected,       // 元件是否被选中
        active,         // 元件是否捕获鼠标事件，当有元件被选中时，其他元件将不接收鼠标事件
        onMouseDown     // 按下时更新canvas中的初始偏移
    } = props;

    /**
     * 用回调将元件状态设置为选中，记录按下时指针对元件左上角的像素偏移
     *
     * @param {*} ev 事件实例
     */
     function handleMouseDown(ev){
        ev.stopPropagation();
        onMouseDown(id, ev.nativeEvent.offsetX - gridCenter.x - pixelX, ev.nativeEvent.offsetY - gridCenter.y - pixelY);
    }

    return (
        <g
        id={id}
        onMouseDown={handleMouseDown}
        opacity={selected ? 0.5 : 1}
        style={{pointerEvents: active ? 'auto' : 'none'}}>
            <Wrapped {...props} />
        </g>
    );
}

export default WithMouseEvent;