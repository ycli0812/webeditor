/**
 * Given a string `type`, this function generates a string like `<type>+<Number>` which
 * is not in `elementSet`. The gnerated string can be used as id of new element.
 *
 * @param {String} type
 * @param {Object} elementSet
 * @return {String} Id generated
 */
function generateTypeId(type, elementSet) {
    let i;
    for (i = 0; type + String(i) in elementSet; i++) { }
    return type + String(i);
}

export { generateTypeId };