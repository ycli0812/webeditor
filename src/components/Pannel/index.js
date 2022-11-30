import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Context
import { EditorContext } from '../../utils/EditorContext';

function Pannel(props) {
    const editor = useContext(EditorContext);
    
    let info = [];
    if(editor.selectedList.length > 0) {
        // console.log(editor.selectedList)
        const type = editor.circuit.elementSet[editor.selectedList[0]].type;
        const features = editor.circuit.elementSet[editor.selectedList[0]].features;
        info.push(<div>{type} {editor.selectedList[0]}</div>);
        for(let i in features) {
            info.push(
                <div>{features[i].name}:{features[i].value} {features[i].unit}</div>
            );
        }
        info.push(
            <button onClick={() => {editor.removeElement(editor.selectedList[0]);}}>delete</button>
        );
    }

    return (
        <div>
            Pennel
            {info}
        </div>
    );
}

export default Pannel;