import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Antd components
import { Input } from 'antd';

// Styles
import fancyInputStyle from './FancyInput.module.css';

function FancyInput(props) {
    const {
        name,
        type,
        placeholder
    } = props;

    const [focused, setFocused] = useState(false);
    const [placeHolderClass, setPlaceholderClass] = useState(fancyInputStyle.placeholderBlured);
    const [isEmpty, setIsEmpty] = useState(true);

    const handleFocus = (ev) => {
        setFocused(true);
        setPlaceholderClass(fancyInputStyle.placeholderFocused);
    };

    const handleBlur = (ev) => {
        if (isEmpty) {
            setPlaceholderClass(fancyInputStyle.placeholderBlured);
        }
        setFocused(false);
    };

    const handleChange = (ev) => {
        console.log(ev);
        const { value } = ev.target;
        if (value == '') {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
        }
    }

    return (
        <div className={focused ? fancyInputStyle.containerFocused : fancyInputStyle.containerBlured}>
            <Input bordered={false} onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange} type={type} />
            <div className={placeHolderClass} style={{ color: focused ? '#1F66FF' : '#AAAAAA' }}>{placeholder}</div>
        </div>
    );
}

export default FancyInput;