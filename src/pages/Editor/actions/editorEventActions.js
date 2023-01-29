/**
 * This action toggles the status of the editor.
 *
 * @param {String} status
 * @return {{type: 'editor/setEditorStatus', payload: Object}} 
 */
export const setEditorStatus = (status) => {
    return {
        type: 'editor/setEditorStatus',
        payload: { status }
    };
};

/**
 * This action stores a grid point into `anchorPoint` state. 
 *
 * @param {{x: Number, y: Number}} point New point or null
 * @return {{type: 'editor/setAnchorPoint', payload: Object}} 
 */
export const setAnchorPoint = (point) => {
    return {
        type: 'editor/setAnchorPoint',
        payload: { point }
    };
};

/**
 * This action updates target element in editor reducer.
 *
 * @param {{id: String, type: String, features: Array}} data What to be updated in target element
 * @return {{type: 'editor/setTragetElement', payload: Object}} 
 */
export const setTragetElement = (data) => {
    return {
        type: 'editor/setTragetElement',
        payload: { ...data }
    };
};

/**
 * This action puts an element into the select list. In other word, it selects
 * an elements.
 *
 * @param {String} id Id of the element to be selected
 * @return {{type: 'editor/selectElement', payload: Object}} 
 */
export const selectElement = (id) => {
    return {
        type: 'editor/selectElement',
        payload: { id }
    };
};

/**
 * This action clears the select list.
 *
 * @return {{type: 'editor/clearSelect'}} 
 */
export const clearSelect = () => {
    return {
        type: 'editor/clearSelect'
    };
};

/**
 * This action sets modified status of the editor.
 *
 * @param {Boolean} modified Whether rhe circuit is modified
 * @return {{type: 'editor/setModified', payload: Object}} 
 */
export const setModified = (modified) => {
    return {
        type: 'editor/setModified',
        payload: { modified }
    };
};