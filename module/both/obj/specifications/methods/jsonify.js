/**
 * Associate class names to their methods declared as "jsonifying a property"
 * with the decorator @jsonify
 */
const jsonify_meths = new Map();
/**
 * Declare and store a cyclic class' property
 *
 * @param target class the object is an instance of
 * @param key property name to set as cyclic
 * @param descriptor property’s descriptor object
 */
export function jsonify(target, key) {
    const class_name = target.constructor.name;
    const class_stored = jsonify_meths.has(class_name);
    const props = class_stored ? jsonify_meths.get(class_name) : [];
    props.push(key);
    //
    // Store the array if not already in cyclic_props
    {
        if (!class_stored) {
            jsonify_meths.set(class_name, props);
        }
    }
}
//
// === KEYS / VALUES / ENTRIES
export function keys(obj) {
    return jsonify_meths.get(obj.constructor.name);
}
export function values(obj) {
    const vals = [];
    const keys = jsonify_meths.get(obj.constructor.name);
    if (!keys) {
        return vals;
    }
    keys.forEach((key) => {
        vals.push(obj[key]);
    });
    return vals;
}
export function entries(obj) {
    const entries = [];
    const keys = jsonify_meths.get(obj.constructor.name);
    if (!keys) {
        return entries;
    }
    keys.forEach((key) => {
        entries.push([key, obj[key]]);
    });
    return entries;
}
//# sourceMappingURL=jsonify.js.map