import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import panelStyle from './Panel.module.css';

// Context
import { EditorContext } from '../../utils/Context';

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
                        <select className={panelStyle.unit} onChange={(ev) => editor.setElementFeatureUnit(id, features[0].name, ev.target.value)}>
                            <option value='om' selected={features[0].unit == 'om'}>Ω</option>
                            <option value='kom' selected={features[0].unit == 'kom'}>KΩ</option>
                            <option value='mom' selected={features[0].unit == 'mom'}>MΩ</option>
                        </select>
                    </div>
                    <div className={panelStyle.subtitle}>误差范围</div>
                    <div className={panelStyle.editable}>
                        <select className={panelStyle.unit} onChange={(ev) => editor.setElementFeature(id, features[1].name, ev.target.value)}>
                            <option value='0.05%' selected={features[1].value == '0.05%'}>0.05%</option>
                            <option value='0.1%' selected={features[1].value == '0.1%'}>0.1%</option>
                            <option value='0.25%' selected={features[1].value == '0.25%'}>0.25%</option>
                            <option value='0.5%' selected={features[1].value == '0.5%'}>0.5%</option>
                            <option value='1%' selected={features[1].value == '1%'}>1%</option>
                            <option value='2%' selected={features[1].value == '2%'}>2%</option>
                            <option value='5%' selected={features[1].value == '5%'}>5%</option>
                            <option value='10%' selected={features[1].value == '10%'}>10%</option>
                        </select>
                    </div>
                </div>
            );
            break;
        }
        case 'breadboard': {
            info = (
                <div>
                    <div className={panelStyle.title}>属性</div>
                    <div className={panelStyle.subtitle}>列</div>
                    <div className={panelStyle.editable}>
                        <div className={panelStyle.content} contentEditable id={'column'} onBlur={(ev) => handleBlur(ev, 'column', id, features[0].name)}>{features[0].value}</div>
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
        if (content != NaN) {
            editor.setElementFeature(eId, name, content);
        }
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