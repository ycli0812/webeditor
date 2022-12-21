import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import panelStyle from './Panel.module.css';

// Context
import { EditorContext } from '../../utils/EditorContext';

function Pannel(props) {
    const editor = useContext(EditorContext);

    if (editor.selectedList.length == 0) {
        return (<div></div>);
    }

    let info;
    const type = editor.circuit.elementSet[editor.selectedList[0]].type;
    const id = editor.selectedList[0];
    const features = editor.circuit.elementSet[editor.selectedList[0]].features;
    // 渲染面板数据
    switch (type) {
        case 'resistor': {
            info = (
                <div>
                    <div className={panelStyle.title}>属性</div>
                    <div className={panelStyle.subtitle}>电阻</div>
                    <div className={panelStyle.editable}>
                        <div className={panelStyle.content} contentEditable id={'resistance'} onBlur={(ev) => handleBlur(ev, 'resistance', id, features[0].name)}>{features[0].value}</div>
                        <select className={panelStyle.unit} onChange={(ev) => handleChange(ev, id, features[0].name)}>
                            <option value='om' selected={features[0].unit=='om'}>Ω</option>
                            <option value='kom' selected={features[0].unit=='kom'}>KΩ</option>
                            <option value='mom' selected={features[0].unit=='mom'}>MΩ</option>
                        </select>
                    </div>
                </div>
            );
            break;
        }
        default: {
            break;
        }
    }

    function handleFocus(ev) {
        console.log('focus', ev);
    }

    function handleBlur(ev, domId, eId, name) {
        const content = Number(document.getElementById(domId).innerHTML);
        console.log(content);
        if(content != NaN) {
            editor.setElementFeature(eId, name, content);
        }
    }

    function handleChange(ev, eId, name) {
        const { value } = ev.target;
        console.log('change', value);
        editor.setElementFeatureUnit(eId, name, value);
    }

    return (
        <div className={panelStyle.panel}>
            <div className={panelStyle.title}>标识符</div>
            <div className={panelStyle.editable}>
                <div className={panelStyle.name}>id</div>
                <div className={panelStyle.content} contentEditable={true} onFocus={handleFocus} onBlur={handleBlur}>{id}</div>
            </div>

            {info}
            <button className={panelStyle.rmbtn} onClick={() => { editor.removeElement(editor.selectedList[0]); }}>remove</button>
        </div>
    );
}

export default Pannel;