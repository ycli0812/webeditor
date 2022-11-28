import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Context
import { EditorContext } from '../../utils/EditorContext';

function ToolBar(props) {
    const editor = useContext(EditorContext);

    function changePointer(ev) {
        editor.toggleStatus('wiring');
    }

    return (
        <div>
            <button onClick={changePointer}>wire</button>
        </div>
    );
}

export default ToolBar;