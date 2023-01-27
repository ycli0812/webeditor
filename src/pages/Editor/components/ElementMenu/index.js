import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom/client';

// Style
import elementMenuStyle from './ElementMenu.module.css';

// Utils

// Context
import { EditorContext } from '../../../../utils/Context';

//Images
import img_r from '../../../../res/elementIcon/resistor.svg';

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

    const editor = useContext(EditorContext);

    function addComponent() {
        let i=0;
        for(; (type+String(i)) in editor.circuit.elementSet; i++);
        editor.toggleStatus({
            status: 'adding',
            targetId:  type+String(i),
            targetFeature: features,
            targetType: type
        });
    }

    return (
        <div className={elementMenuStyle.elementSample} onClick={addComponent}>
            <img src={imgSrc} alt=''></img>
            <div selectable="false">{text}</div>
        </div>
    );
}

function ElementMenu(props) {
    // const {
    //     onUpdateElementSet
    // } = props;

    const templates = useRequestElementList();

    return (
        <div id={elementMenuStyle.elementMenu}>
            {/* <ElementSample imgSrc={img_r} name='电阻' /> */}
            {templates.map((item, index) => {
                return <ElementSample key={index} imgSrc={img_r} type={item.type} text={item.text} features={item.defaultFeatures} />
            })}
        </div>
    );
}

export default ElementMenu;