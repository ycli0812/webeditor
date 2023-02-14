import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import inputCellStyle from './InputCell.module.css';

// Regular Expressions
const regColor = /^#[0-9A-Fa-f]{6}$/;
const regInt = /^[0-9]*$/;
const regFloat = /^[0-9]*\.[0-9]*$/;

function useSlot(slotName, children) {
    const type = Object.prototype.toString.call(children);
    if (type == '[object Object]') {
        if ('slot' in children.props && children.props.slot == slotName) {
            return children;
        }
    } else {
        for (let i in children) {
            if ('slot' in children[i].props && children[i].props.slot == slotName) {
                return children[i];
            }
        }
    }
    return null;
}

function findDefaultIndex(options, value) {
    let i;
    for (i = 0; i < options.length; i++) {
        if (value === options[i].name) return i;
    }
    return 0;
}

function InputCell(props) {
    const {
        title = '',                     // 标题
        type = 'string',                // 类型，合法值：number, integer, float, string, select(default), switch, password
        readonly = false,               // 是否只读（对select无效）
        value,                          // 原始值
        unit = '',                      // 单位
        valueOptions = [],              // 选项列表（type为select时必填）
        unitOptions = [],               // 可选单位
        onValueChange = (v) => { },     // 内容改变的回调
        onUnitChange = (v) => { },      // 单位改变的回调
        pattern = /.*/,                 // 检查输入合法性的正则表达式，默认值是匹配任何字符串的正则表达式
        backgroundColor = '#EEEEEE',    // 背景颜色
        blurFix = true,                 // 失焦时是否隐藏input固定内容
        children                        // 插槽组件
    } = props;

    const [isEditing, setIsEditing] = useState(false);
    const [redioActiveIndex, setRadioActiveIndex] = useState(findDefaultIndex(valueOptions, value));
    // const [valueRestore, setValueRestore] = useState(value);

    function handleInputBlur(ev) {
        const targetValue = ev.target.value;
        setIsEditing(false);
        // 验证pattern
        if (!pattern.test(targetValue)) {
            return;
        }
        // 检查input内数据合法性
        switch (type) {
            case 'number': {
                if (isNaN(Number(targetValue))) {
                    console.error('error: can not cast\'', targetValue, '\'to a number', Number(targetValue));
                } else {
                    console.log(targetValue, 'cast to', Number(targetValue));
                    onValueChange(Number(targetValue));
                }
                break;
            }
            case 'integer': {
                if (regInt.test(targetValue)) {
                    onValueChange(Number(targetValue));
                }
                break;
            }
            case 'float': {
                if (regFloat.test(targetValue)) {
                    onValueChange(Number(targetValue));
                }
                break;
            }
            case 'color': {
                if (regColor.test(targetValue)) {
                    onValueChange(targetValue.toUpperCase());
                }
                break;
            }
            default: {
                onValueChange(targetValue);
                break;
            }
        }
    }

    function handleValueSelectChange(ev) {
        const targetValue = ev.target.value;
        console.log('value select blur:', ev);
        onValueChange(targetValue);
    }

    function handleUnitChange(ev) {
        const targetValue = ev.target.value;
        console.log('unit select blur:', targetValue);
        onUnitChange(targetValue);
    }

    function handleClick(ev) {
        // const targetValue = ev.target.value;
        setIsEditing(true & !readonly);
        // setValueRestore(targetValue);
    }

    function handleRadioClick(index) {
        setRadioActiveIndex(index);
        onValueChange(valueOptions[index].name);
    }

    // icon插槽，左侧区域
    let icon = useSlot('icon', children);

    // content插槽，中间区域
    let content = useSlot('content', children);

    // 中间部分，编辑区
    let contentEditor;
    switch (type) {
        case 'select': {
            contentEditor = (
                <select className={inputCellStyle.select} defaultValue={value} onChange={handleValueSelectChange}>
                    {valueOptions.map((item, index) => {
                        return (<option key={index} value={item.name}>{item.value}</option>);
                    })}
                </select>
            );
            break;
        }
        case 'radio': {
            contentEditor = (
                <div className={inputCellStyle.radioOptions} style={{ gridTemplateColumns: `repeat(${valueOptions.length}, auto)` }}>
                    <div className={inputCellStyle.radioSelecotr} style={{ width: `calc(100% / ${valueOptions.length} - 2px)`, left: `calc(100% / ${valueOptions.length} * ${redioActiveIndex})` }}></div>
                    {valueOptions.map((item, index) => {
                        return (<span key={index} className={inputCellStyle.radioOption} value={item.name} onClick={(ev) => { handleRadioClick(index); }}>{item.value}</span>);
                    })}
                </div>
            );
            break;
        }
        default: {
            if (content != null) {
                contentEditor = content;
                break;
            }
            if (isEditing || !blurFix) {
                contentEditor = (
                    <input className={inputCellStyle.input} type='text' onBlur={handleInputBlur} defaultValue={value} autoFocus />
                );
            } else {
                contentEditor = (
                    <div className={inputCellStyle.value} onClick={handleClick}>{value}</div>
                );
            }
            break;
        }
    }

    // 右侧，单位
    let unitEditor;
    if (unitOptions.length > 0) {
        unitEditor = (
            <select className={inputCellStyle.select} defaultValue={unit} onChange={handleUnitChange}>
                {unitOptions.map((item, index) => {
                    return (<option key={index} value={item.name}>{item.value}</option>);
                })}
            </select>
        );
    } else {
        unitEditor = null;
    }

    let columns = [];
    if (icon != null) columns.push('20px');
    columns.push('auto');
    if (unitEditor != null) columns.push('60px');

    return (
        <div>
            <div className={inputCellStyle.subtitle}>{title}</div>
            <div className={inputCellStyle.fetureInput} style={{ gridTemplateColumns: columns.join(' '), backgroundColor: backgroundColor }}>
                {icon}
                {contentEditor}
                {unitEditor}
            </div>
        </div>
    );
}

export default InputCell;