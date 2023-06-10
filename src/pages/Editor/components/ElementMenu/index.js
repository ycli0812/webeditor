import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useDispatch, useSelector } from 'react-redux';

// Style
import elementMenuStyle from './ElementMenu.module.css';

// Utils
import { generateTypeId } from '../../../../utils/IdGenerator';

//Images
import expend from '../../../../assets/expend.svg';
import resistor_demo from '../../../../assets/elements/resistor.svg';
import breadboard_demo from '../../../../assets/elements/breadboard1.svg';
import switch_demo from '../../../../assets/elements/switch.svg';
import capacitor_demo from '../../../../assets/elements/capacitor.svg';
import led_demo from '../../../../assets/elements/LED.svg'
import voltage_source_demo from '../../../../assets/elements/voltage_source.svg';

// Redux actions
import { setEditorStatus, setTragetElement, setElementTemplates } from '../../slices/editorSlice';

// Antd components
import { Tooltip } from 'antd';

function ElementItem(props) {
    const {
        type,
        text,
        imgSrc,                     // 图片url
    } = props;

    const dispatch = useDispatch();
    const { elementSet } = useSelector(state => state.editor.circuit);

    function handleClick() {
        dispatch(setEditorStatus('adding'));
        dispatch(setTragetElement({
            id: generateTypeId(type, elementSet),
            type: type
        }));
    }

    return (
        <div className={elementMenuStyle.elementItem} onClick={handleClick}>
            <img alt='' src={imgSrc} />
            <Tooltip title={text} placement='right' mouseEnterDelay={0} mouseLeaveDelay={0}>
                <div>{text}</div>
            </Tooltip>
        </div>
    );
}

function Collapse(props) {
    const {
        children
    } = props;

    // for(let i = 0; i < children.length(); i++) {
    //     if(children[i].key === undefined) {}
    // }

    return (
        <div className={elementMenuStyle.collapse}>
            {children}
        </div>
    );
}

function Panel(props) {
    const {
        header,
        onExpend,
        key,
        children
    } = props;

    const [active, setActive] = useState(false);

    const handleClick = (ev) => {
        setActive(!active);
    };

    // console.log(children);

    let panelHeight = 97;
    if(children.props.children.length !== undefined) {
        panelHeight = Math.ceil(children.props.children.length / 2) * 97;
    }

    return (
        <div className={elementMenuStyle.panel} style={{borderBottom: active ? 'none' : 'inherit'}}>
            <div className={elementMenuStyle.panelHeader} onClick={handleClick}>
                <img alt='' src={expend} style={{ transform: `rotate(${active ? '0' : '-90'}deg)` }} />
                <span>{header}</span>
            </div>
            {/* {active ? <div className={elementMenuStyle.panelBody}>{children}</div> : null} */}
            <div className={elementMenuStyle.panelBody} style={{height: active ? panelHeight : 0}}>{children}</div>
        </div>
    );
}

function ElementMenu(props) {
    // useRequestElementList();
    const { elementTemplates: templates } = useSelector(state => state.editor);

    return (
        <div id={elementMenuStyle.elementMenu}>
            <Collapse>
                <Panel header='Breadboard'>
                    <div className={elementMenuStyle.groupList}>
                        <ElementItem type='breadboard' text='Breadboard' imgSrc={breadboard_demo} />
                    </div>
                </Panel>
                <Panel header='Basics'>
                    <div className={elementMenuStyle.groupList}>
                        <ElementItem type='resistor' text='Resistor' imgSrc={resistor_demo} />
                        <ElementItem type='capacitor' text='Capacitor' imgSrc={capacitor_demo} />
                        <ElementItem type='switch' text='Micro Switch' imgSrc={switch_demo} />
                        <ElementItem type='led' text='LED' imgSrc={led_demo} />
                        <ElementItem type='source' text='Voltage Source' imgSrc={voltage_source_demo} />
                    </div>
                </Panel>
            </Collapse>
        </div>
    );
}

export default ElementMenu;