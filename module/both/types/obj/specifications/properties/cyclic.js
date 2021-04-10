/**
 * Associate class names to their properties declared as cyclic
 * with the decorator @cyclic
 */
const cyclic_props = new Map();
/**
 * Declare and store a cyclic class' property
 *
 * @param target class the object is an instance of
 * @param key property name to set as cyclic
 * @param descriptor property’s descriptor object
 */
export function cyclic(target, key, descriptor) {
    const class_name = target.constructor.name;
    const class_stored = cyclic_props.has(class_name);
    const props = class_stored ? cyclic_props.get(class_name) : [];
    props.push(key);
    //
    // Store the array if not already in cyclic_props
    {
        if (!class_stored) {
            cyclic_props.set(class_name, props);
        }
    }
    return descriptor;
}
//
// === KEYS / VALUES / ENTRIES
export function keys(obj) {
    const keys = cyclic_props.get(obj.constructor.name);
    if (keys) {
        return keys;
    }
    return [];
}
export function values(obj) {
    const vals = [];
    const keys = cyclic_props.get(obj.constructor.name);
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
    const keys = cyclic_props.get(obj.constructor.name);
    if (!keys) {
        return entries;
    }
    keys.forEach((key) => {
        entries.push([key, obj[key]]);
    });
    return entries;
}
//# sourceMappingURL=cyclic.js.map