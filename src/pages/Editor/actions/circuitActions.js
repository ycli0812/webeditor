/**
 * This action update the circuit in circuit reducer.
 *
 * @param {Object} circuit
 * @return {{type: 'circuit/setCircuit', payload: Object}} 
 */
export const setCircuit = (circuit) => {
    return {
        type: 'circuit/setCircuit',
        payload: { circuit }
    };
};

/**
 * This action adds an element to the circuit.
 *
 * @param {String} id
 * @param {String} type
 * @param {{x: Number, y: Number}} pos 
 * @param {Array} features
 * @return {{type: 'circuit/addElement', payload: Object}} 
 */
export const addElement = (id, type, pos, features) => {
    return {
        type: 'circuit/addElement',
        payload: { id, type, pos, features }
    };
};

/**
 * This action add the draft element stored in editor reducer into the circuit.
 * The position to place the element should be given.
 * 
 * Note that currently, we can not visit eitor reducer in circuit reducer. So
 * this action is taged deprecated.
 *
 * @deprecated
 * @param {Number} x X-axis coordinate of grid position
 * @param {Number} y Y-axis coordinate of grid position
 * @return {{type: 'circuit/addDraftElement', payload: Object}} 
 */
export const addDraftElement = (x, y) => {
    return {
        type: 'circuit/addDraftElement',
        payload: { x, y }
    };
};

/**
 * This action sets parameters of a certain element which is specified by id.
 * Id and values of parameters are pass in Object `data`.
 * 
 * Note that this action will overwrite the feature list of the target element
 * if `features` field is given in data.
 * 
 * @param {{id: String, pos: {x: Number, y: Number}, type: String, features: []}} data All fields are optional other than `id`.
 * @return {{type: 'circuit/setElementInfo', payload: Object}}
*/
export const setElementInfo = (data) => {
    return {
        type: 'circuit/setElementInfo',
        payload: { ...data }
    };
};


/**
 * This action sets a certain feature of a certain element specified by id. It
 * can change value or unit of the feature. If either of them is not given, the
 * un-given one will remain its original value.
 *
 * @param {{id: String, name: String, value: any, unit: String}} data
 * @return {{type: 'circuit/setElementFeature', payload: Object}} 
 */
export const setElementFeature = (data) => {
    return {
        type: 'circuit/setElementFeature',
        payload: { ...data }
    }
};

/**
 * This action removes a certain element given its id.
 *
 * @param {String} id The id of the element to be removed.
 * @return {{type: 'circuit/removeElement', payload: Object}}
 */
export const removeElement = (id) => {
    return {
        type: 'circuit/removeElement',
        payload: { id }
    };
};

/**
 * This action changes id of an element.
 *
 * @param {String} originId
 * @param {String} newId
 * @return {{type: 'circuit/changeElementId', payload: Object}} 
 */
export const changeElementId = (originId, newId) => {
    return {
        type: 'circuit/changeElementId',
        payload: { originId, newId }
    };
};