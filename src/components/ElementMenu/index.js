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
        name,
        imgSrc,
        onUpdateElementSet,
        elementSet
    } = props;

    const editor = useContext(EditorContext);

    function addComponent() {
        let newSet = {...elementSet};
        let i=0
        for(; ('R'+String(i)) in newSet; i++);
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
    const {
        elementSet,
        onUpdateElementSet
    } = props;

    return (
        <div id='element-menu'>
            <ElementSample imgSrc={img_r} name='电阻' {...props} />
        </div>
    );
}

export default ElementMenu;