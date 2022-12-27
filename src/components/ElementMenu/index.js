import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import elementMenuStyle from './ElementMenu.module.css';

// Utils

// Context
import { EditorContext } from '../../utils/Context';

//Images
import img_r from '../../res/elementIcon/resistor.svg';

function ElementSample(props) {
    const {
        name,                       // 名称
        imgSrc,                     // 图片url
    } = props;

    const editor = useContext(EditorContext);

    function addComponent() {
        let i=0;
        for(; ('R'+String(i)) in editor.circuit.elementSet; i++);
        editor.toggleStatus('adding', 'R'+String(i));
    }

    return (
        <div className={elementMenuStyle.elementSample} onClick={addComponent}>
            <img src={imgSrc} alt=''></img>
            <div selectable={false}>{name}</div>
        </div>
    );
}

function ElementMenu(props) {
    // const {
    //     onUpdateElementSet
    // } = props;

    return (
        <div id={elementMenuStyle.elementMenu}>
            <ElementSample imgSrc={img_r} name='电阻' />
        </div>
    );
}

export default ElementMenu;