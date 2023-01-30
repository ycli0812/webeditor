import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useDispatch, useSelector } from 'react-redux';

// Style
import elementMenuStyle from './ElementMenu.module.css';

// Utils
import { generateTypeId } from '../../../../utils/IdGenerator';

//Images
import img_r from '../../../../assets/elementIcon/resistor.svg';

// Redux actions
import { setEditorStatus, setTragetElement, setElementTemplates } from '../../slices/editorSlice';

function ElementSample(props) {
    const {
        type,
        text,
        imgSrc,                     // 图片url
        features,
    } = props;

    const dispatch = useDispatch();
    const { elementSet } = useSelector(state => state.editor.circuit);

    function handleClick() {
        dispatch(setEditorStatus('adding'));
        dispatch(setTragetElement({
            id: generateTypeId(type, elementSet),
            type: type,
            features: features
        }));
    }

    return (
        <div className={elementMenuStyle.elementSample} onClick={handleClick}>
            <img src={imgSrc} alt=''></img>
            <div selectable="false">{text}</div>
        </div>
    );
}

function ElementMenu(props) {
    // useRequestElementList();
    const { elementTemplates: templates } = useSelector(state => state.editor);

    return (
        <div id={elementMenuStyle.elementMenu}>
            {templates.map((item, index) => {
                return <ElementSample key={index} imgSrc={img_r} type={item.type} text={item.text} features={item.defaultFeatures} />
            })}
        </div>
    );
}

export default ElementMenu;