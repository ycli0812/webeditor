import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import './ElementMenu.scss';

// Utils

//Images
import img_r from '../../res/resistor.svg';

function ElementSample(props) {
    const { name, imgSrc } = props;
    return (
        <div className='element-sample'>
            <img src={imgSrc} alt=''></img>
            <text>{name}</text>
        </div>
    );
}

function ElementMenu(props) {
    return (
        <div id='element-menu'>
            <ElementSample imgSrc={img_r} name='电阻' />
            <ElementSample imgSrc={img_r} name='电阻' />
            <ElementSample imgSrc={img_r} name='电阻' />
            <ElementSample imgSrc={img_r} name='电阻' />
            <ElementSample imgSrc={img_r} name='电阻' />
            <ElementSample imgSrc={img_r} name='电阻' />
            <ElementSample imgSrc={img_r} name='电阻' />
            <ElementSample imgSrc={img_r} name='电阻' />
        </div>
    );
}

export default ElementMenu;