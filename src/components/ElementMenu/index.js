import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import './ElementMenu.scss';

// Utils

// Context
import { EditorContext } from '../../utils/EditorContext';

//Images
import img_r from '../../res/resistor.svg';

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
        <div className='element-sample' onClick={addComponent}>
            <img src={imgSrc} alt=''></img>
            <text>{name}</text>
        </div>
    );
}

function ElementMenu(props) {
    // const {
    //     onUpdateElementSet
    // } = props;

    return (
        <div id='element-menu'>
            <ElementSample imgSrc={img_r} name='电阻' />
        </div>
    );
}

export default ElementMenu;