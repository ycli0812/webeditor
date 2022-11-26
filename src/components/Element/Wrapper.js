import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import './Element.scss';

function withMouseEvent(Wrapped, props) {
    const { 
        gridPos,        // 元件左上角在grid坐标系的坐标（整数）
        zoom,           // 放大倍数，grid边长=zoom*5
        wireWidth,      // 元件引脚处线宽
        id,             // 元件id，也是g标签的id，所有id不会重复
        gridCenter,     // grid坐标系原点在canvas中的像素坐标
        selected,       // 元件是否被选中
        active,         // 元件是否捕获鼠标事件，当有元件被选中时，其他元件将不接收鼠标事件
        pinLis,         // 引脚列表，包含每个引脚相对元件的位置
        onMove,         // 改变元件grid坐标的回调，鼠标抬起时调用
        onSelect        // 被选中时的回调，鼠标按下时调用
    } = props;

    

    return (
        <g>
            <Wrapped {...props} />
        </g>
    );
}