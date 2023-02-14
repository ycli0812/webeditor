import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useSelector, useDispatch } from 'react-redux';

// Style
import panelStyle from './Panel.module.css';

// Context
// import { EditorContext } from '../../../../utils/Context';

// Components
import InputCell from '../../../../components/InputCell/InputCell';

// Redux actions
// import { addElement, removeElement, setElementFeature } from '../../actions/circuitActions';
// import { clearSelect } from '../../actions/editorEventActions';
import { addElement, removeElement, setElementFeature, clearSelect } from '../../slices/editorSlice';

// Hooks
import { useFeatureValueGetter, useFeatureUnitGetter } from '../../hooks/ElementFeatureSelector';

// Antd components
import { Radio } from 'antd';

function Pannel(props) {
    // const editor = useContext(EditorContext);
    // 从store中取出target元件id
    const dispatch = useDispatch();

    let info;

    const { selectedList, circuit } = useSelector(state => state.editor);
    const id = selectedList[0];
    // console.log('selected id:', selectedList);
    const getValue = useFeatureValueGetter(id);
    const getUnit = useFeatureUnitGetter(id);
    // console.log('test getFeature:', getFeature('resistance'));

    if (selectedList.length == 0) {
        return (<div></div>);
    }
    // console.log('test', getValue('resistance'), getUnit('resistance'));

    const type = circuit.elementSet[id].type;
    const features = circuit.elementSet[id].features;

    // 渲染面板数据
    switch (type) {
        case 'resistor': {
            console.log('test', getValue('resistance'), getUnit('resistance'));
            info = (
                <div>
                    <div className={panelStyle.title}>属性</div>
                    <InputCell type='number' title='电阻' value={getValue('resistance')} unit={getUnit('resistance')}
                        unitOptions={[{ name: 'om', value: 'Ω' }, { name: 'kom', value: 'KΩ' }, { name: 'mom', value: 'MΩ' }]}
                        onValueChange={(value) => { dispatch(setElementFeature({ id, name: 'resistance', value })); }}
                        onUnitChange={(unit) => { dispatch(setElementFeature({ id, name: 'resistance', unit })); }}>
                    </InputCell>
                    <InputCell type='select' title='误差范围' value={features[1].value}
                        valueOptions={[{ name: '0.05%', value: '0.05%' }, { name: '0.1%', value: '0.1%' }, { name: '0.25%', value: '0.25%' }, { name: '0.5%', value: '0.5%' }, { name: '1%', value: '1%' }, { name: '2%', value: '2%' }, { name: '5%', value: '5%' }, { name: '10%', value: '10%' }]}
                        onValueChange={(value) => { dispatch(setElementFeature({ id, name: 'tolerance', value })); }}>
                    </InputCell>
                </div>
            );
            break;
        }
        case 'breadboard': {
            info = (
                <div>
                    <InputCell type='integer' title='列' value={features[0].value}
                        onValueChange={(value) => { dispatch(setElementFeature({ id, name: 'column', value })); }}>
                    </InputCell>
                    <InputCell type='radio' title='扩展' value={getValue('extended', id)}
                        valueOptions={[{ name: true, value: '打开' }, { name: false, value: '关闭' }]}
                        onValueChange={(value) => { dispatch(setElementFeature({ id, name: 'extended', value })); }}>
                    </InputCell>
                </div>
            );
            break;
        }
        case 'wire': {
            info = (
                <div>
                    <InputCell type='color' title='颜色' value={getValue('color')}
                        onValueChange={(value) => { dispatch(setElementFeature({ id, name: 'color', value })); }}>
                        <div slot='icon' style={{ backgroundColor: getValue('color'), height: '16px', width: '16px', borderRadius: '50%', marginLeft: '10px' }}></div>
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
            <button className={panelStyle.rmbtn} onClick={() => { dispatch(clearSelect()); dispatch(removeElement(id)); }}>remove</button>
        </div>
    );
}

export default Pannel;