import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useDispatch, useSelector } from 'react-redux';

// Style
import elementMenuStyle from './ElementMenu.module.css';

// Utils

// Context
import { EditorContext } from '../../../../utils/Context';

//Images
import img_r from '../../../../res/elementIcon/resistor.svg';

// Redux actions
import { setEditorStatus, setTragetElement } from '../../actions/editorEventActions';
import { generateTypeId } from '../../../../utils/IdGenerator';

function useRequestElementList() {
    const [templates, setTemplates] = useState([]);
    useEffect(() => {
        // TODO: send request
        setTemplates([
            {
                type: 'resistor',
                text: '电阻',
                defaultFeatures: [
                    {
                        name: 'resistance',
                        value: 1,
                        unit: 'om'
                    },
                    {
                        name: 'tolerance',
                        value: '1%'
                    }
                ]
            },
            {
                type: 'breadboard',
                text: '面包板',
                defaultFeatures: [
                    {
                        name: 'column',
                        value: 10
                    }
                ]
            }
        ]);
    }, []);

    return templates;
}

function ElementSample(props) {
    const {
        type,
        text,
        imgSrc,                     // 图片url
        features,
    } = props;

    // const editor = useContext(EditorContext);
    const dispatch = useDispatch();
    const { elementSet } = useSelector(state => state.circuit.circuit);

    function handleClick() {
        dispatch(setEditorStatus('adding'));
        dispatch(setTragetElement({
            id: generateTypeId(type, elementSet),
            type: type,
            features: features
        }));
    }

    return (
        <div className={elementMenuStyle.elementSample} onClick={handleClick}>
            <img src={imgSrc} alt=''></img>
            <div selectable="false">{text}</div>
        </div>
    );
}

function ElementMenu(props) {
    const templates = useRequestElementList();

    return (
        <div id={elementMenuStyle.elementMenu}>
            {templates.map((item, index) => {
                return <ElementSample key={index} imgSrc={img_r} type={item.type} text={item.text} features={item.defaultFeatures} />
            })}
        </div>
    );
}

export default ElementMenu;