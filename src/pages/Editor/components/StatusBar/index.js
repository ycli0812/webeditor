import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Style
import statusbarStyle from './StatusBar.module.css';

function StatusBar(props) {
    const { status, target } = useSelector(state => state.editor);

    let text = '';
    switch(status) {
        case 'default': {
            text = 'Ready';
            break;
        }
        case 'adding': {
            text += 'Inserting ';
            text += target.type;
            // text += ' waiting for point ';
            // text += target.pins.length + 1;
            break;
        }
        default: {
            text = 'Ready';
            break;
        }
    }

    return (
        <div className={statusbarStyle.body}>
            {/* <span>{status == 'default' ? 'Ready' : ''}</span>
            <span>{status == 'adding' ? 'Inserting ' + target.type : ''}</span> */}
            {text}
        </div>
    );
}

export default StatusBar;