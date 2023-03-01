import { useSelector } from 'react-redux';

/**
 * This hook returns a function with an optional parameter id. This returned function selects
 * value of a certain feature of an element.If `id` is given to the hook, the selector function
 * can be called without giving another `id`. Otherwise `id` must be given to indicate whcih
 * element to select feature value from.
 * 
 * If the given feature name does not exist, the selector function will return `undefined`.
 *
 * @param {String | undefined} id Id of an element
 * @return {(name: String, id: String | undefined) => String} Selector function 
 */
const useFeatureValueGetter = (id) => {
    const { elementSet } = useSelector(state => state.editor.circuit);
    return (name, _id) => {
        const usedId = _id === undefined ? id : _id;
        if(!(usedId in elementSet)) {
            return;
        }
        const { features } = elementSet[usedId];
        for (let i in features) {
            if (features[i].name === name) {
                return features[i].value;
            }
        }
    };
};

/**
 * This hook returns a function with an optional parameter id. This returned function selects
 * unit of a certain feature of an element.If `id` is given to the hook, the selector function
 * can be called without giving another `id`. Otherwise `id` must be given to indicate whcih
 * element to select feature unit from.
 * 
 * If the given feature name does not exist, or the feature does not have a unit, the selector
 * function will return `undefined`.
 *
 * @param {String | undefined} id Id of an element
 * @return {(name: String, id: String | undefined) => String} Selector function 
 */
const useFeatureUnitGetter = (id) => {
    const { elementSet } = useSelector(state => state.editor.circuit);
    return (name, _id) => {
        const usedId = _id === undefined ? id : _id;
        if(!(usedId in elementSet)) {
            return;
        }
        const { features } = elementSet[usedId];
        for (let i in features) {
            if (features[i].name === name) {
                return features[i].unit;
            }
        }
    };
};

const usePinPositionGetter = (id) => {
    const { elementSet } = useSelector(state => state.editor.circuit);
    return (name, _id) => {
        const usedId = _id === undefined ? id : _id;
        if(!(usedId in elementSet)) {
            return;
        }
        const { pins } = elementSet[usedId];
        for (let i in pins) {
            if (pins[i].name === name) {
                return {
                    x: pins[i].x,
                    y: pins[i].y
                };
            }
        }
    };
};

export { useFeatureValueGetter, useFeatureUnitGetter, usePinPositionGetter };