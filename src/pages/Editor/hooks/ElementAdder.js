import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Utils
import { generateTypeId } from '../../../utils/IdGenerator';

// Reduc actions
import { setTragetElement, applyDraftElement, setDraftInfo } from '../slices/editorSlice';

// Antd components
import { message } from 'antd';

/**
 * This hook generates an element adder.
 *
 * @return {*} 
 */
function useElementAdder() {
    const dispatch = useDispatch();
    const { elementTemplates, circuit, target: { type: curType }, target } = useSelector(state => state.editor);
    const [countPoints, setCountPoints] = useState(0);

    // when type to add changes, reset adding progress
    useEffect(() => {
        clearCount();
    }, [curType]);

    const clearCount = () => {
        setCountPoints(0);
    };

    const incCount = () => {
        setCountPoints(countPoints + 1);
    };

    const initDraft = (_type) => {
        for (let i in elementTemplates) {
            if (elementTemplates[i].type === _type) {
                dispatch(setTragetElement({
                    type: _type,
                    x: 0,
                    y: 0,
                    pins: elementTemplates[i].pins,
                    features: elementTemplates[i].defaultFeatures
                }));
                return;
            }
        }
        // draft = null;
    };

    const resistorAdder = (x, y) => {
        switch (countPoints) {
            case 0: {
                // setting start point and position (x and y)
                initDraft('resistor');
                dispatch(setDraftInfo({
                    x,
                    y,
                    pins: [{ name: 'start', x, y }]
                }));
                incCount();
                console.log('resistor point 1');
                return false;
            }
            case 1: {
                // check distance
                const { x: preX, y: preY } = target.pins[0];
                if (Math.sqrt((x - preX) * (x - preX) + (y - preY) * (y - preY)) < 3) {
                    message.error('Too close!', 0.6);
                    return false;
                }
                // setting end point
                dispatch(setDraftInfo({
                    pins: [{ name: 'end', x, y }]
                }));
                clearCount();
                // add draft element to circuit
                dispatch(applyDraftElement());
                console.log('resistor point 2');
                return true;
            }
            default: break;
        }
    };

    const capacitorAdder = (x, y) => {
        switch (countPoints) {
            case 0: {
                // setting start point and position (x and y)
                initDraft('capacitor');
                dispatch(setDraftInfo({
                    x,
                    y,
                    pins: [{ name: 'start', x, y }]
                }));
                incCount();
                console.log('capacitor point 1');
                return false;
            }
            case 1: {
                // setting end point
                dispatch(setDraftInfo({
                    pins: [{ name: 'end', x, y }]
                }));
                clearCount();
                // add draft element to circuit
                dispatch(applyDraftElement());
                console.log('capacitor point 2');
                return true;
            }
            default: break;
        }
    };

    const ledAdder = (x, y) => {
        switch (countPoints) {
            case 0: {
                // setting start point and position (x and y)
                initDraft('led');
                dispatch(setDraftInfo({
                    x,
                    y,
                    pins: [{ name: 'positive', x, y }]
                }));
                incCount();
                console.log('LED point 1');
                return false;
            }
            case 1: {
                // setting end point
                dispatch(setDraftInfo({
                    pins: [{ name: 'negative', x, y }]
                }));
                clearCount();
                // add draft element to circuit
                dispatch(applyDraftElement());
                console.log('LED point 2');
                return true;
            }
            default: break;
        }
    };

    const wireAdder = (x, y) => {
        switch (countPoints) {
            case 0: {
                // setting x1 and y1
                initDraft('wire');
                dispatch(setDraftInfo({
                    x,
                    y,
                    features: [
                        { name: 'x1', value: x },
                        { name: 'y1', value: y }
                    ]
                }));
                incCount();
                console.log('wire point 1');
                return false;
            }
            case 1: {
                // setting x2 and y2
                dispatch(setDraftInfo({
                    features: [
                        { name: 'x2', value: x },
                        { name: 'y2', value: y }
                    ]
                }));
                clearCount();
                // add draft element to circuit
                dispatch(applyDraftElement());
                console.log('wire point 2');
                return true;
            }
            default: break;
        }
    };

    const breadboardAdder = (x, y) => {
        initDraft('breadboard');
        dispatch(setDraftInfo({
            x,
            y,
            features: [
                { name: 'column', value: 15 },
                { name: 'extended', value: true }
            ]
        }));
        dispatch(applyDraftElement());
        clearCount();
        return true;
    };

    const switchAdder = (x, y) => {
        initDraft('switch');
        dispatch(setDraftInfo({
            x,
            y,
            features: []
        }));
        dispatch(applyDraftElement());
        clearCount();
        return true;
    };

    const sourceAdder = (x, y) => {
        initDraft('source');
        dispatch(setDraftInfo({
            x,
            y,
            features: []
        }));
        dispatch(applyDraftElement());
        clearCount();
        return true;
    };

    const generalAdder = (type, x, y) => {
        switch (type) {
            case 'resistor': return resistorAdder(x, y);
            case 'wire': return wireAdder(x, y);
            case 'breadboard': return breadboardAdder(x, y);
            case 'switch': return switchAdder(x, y);
            case 'capacitor': return capacitorAdder(x, y);
            case 'led': return ledAdder(x, y);
            case 'source': return sourceAdder(x, y);
            default: return false;
        }
    };

    // switch (type) {
    //     case 'resistor': return resistorAdder;
    //     case 'wire': return wireAdder;
    //     case 'breadboard': return breadboardAdder;
    //     case 'switch': return switchAdder;
    //     default: return generalAdder;
    // }
    return generalAdder;
}

export default useElementAdder;