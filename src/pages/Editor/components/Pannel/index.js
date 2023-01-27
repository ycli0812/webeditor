import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useSelector, useDispatch } from 'react-redux';

// Style
import panelStyle from './Panel.module.css';

// Context
import { EditorContext } from '../../../../utils/Context';

// Components
import InputCell from '../../../../components/InputCell/InputCell';

// Actions
// import { setTargetId } from '../../reducers';

function Pannel(props) {
    const editor = useContext(EditorContext);
    // 从store中取出target元件id
    // const targetId = useSelector(state => state.editor.target.id);
    // const dispatch = useDispatch();

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
                    <InputCell type='number' title='电阻' value={features[0].value} unit={features[0].unit}
                               unitOptions={[{name:'om', value:'Ω'}, {name:'kom', value:'KΩ'}, {name:'mom', value:'MΩ'}]}
                               onValueChange={(value) => {editor.setElementFeature(id, 'resistance', value);}}
                               onUnitChange={(value) => {editor.setElementFeatureUnit(id, 'resistance', value);}}>
                    </InputCell>
                    <InputCell type='select' title='误差范围' value={features[1].value}
                               valueOptions={[{name:'0.05%', value:'0.05%'},{name:'0.1%', value:'0.1%'},{name:'0.25%', value:'0.25%'},{name:'0.5%', value:'0.5%'},{name:'1%', value:'1%'},{name:'2%', value:'2%'},{name:'5%', value:'5%'},{name:'10%', value:'10%'}]}
                               onValueChange={(value) => {editor.setElementFeature(id, 'tolerance', value);}}>
                    </InputCell>
                </div>
            );
            break;
        }
        case 'breadboard': {
            info = (
                <div>
                    <InputCell type='integer' title='列' value={features[0].value}
                               onValueChange={(value) => {editor.setElementFeature(id, 'columns', value);}}>
                    </InputCell>
                </div>
            );
            break;
        }
        case 'wire': {
            const [
                { value: x1 } = { value: 0 },
                { value: y1 } = { value: 0 },
                { value: x2 } = { value: 0 },
                { value: y2 } = { value: 0 },
                { value: hexColor } = { value: '#000000' }
            ] = features;
            info = (
                <div>
                    <InputCell type='color' title='颜色' value={hexColor}
                               onValueChange={(value) => {editor.setElementFeature(id, 'color', value);}}>
                                <div slot='icon' style={{backgroundColor: hexColor, height: '16px', width: '16px', borderRadius: '50%'}}></div>
                    </InputCell>
                </div>
            );
        }
        default: {
            break;
        }
    }

    return (
        <div className={panelStyle.panel}>
            <InputCell type='string' title='标识符' value={id} backgroundColor='#DDDDDD' readonly></InputCell>
            {info}
            <button className={panelStyle.rmbtn} onClick={() => { editor.removeElement(editor.selectedList[0]); }}>remove</button>
        </div>
    );
}

export default Pannel;