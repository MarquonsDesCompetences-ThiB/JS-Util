/**
 * Associate class names to their methods declared as
 * meta, eg. about the object itself
 * with the decorator @meta
 */
const meta_meths = new Map();
/**
 * Declare and store a meta class' property
 *
 * @param target class the object is an instance of
 * @param key property name to set as meta
 * @param descriptor property’s descriptor object
 */
export function meta(target, key) {
    const class_name = target.constructor.name;
    const class_stored = meta_meths.has(class_name);
    const props = class_stored ? meta_meths.get(class_name) : [];
    props.push(key);
    //
    // Store the array if not already in meta_meths
    {
        if (!class_stored) {
            meta_meths.set(class_name, props);
        }
    }
}
//
// === KEYS / VALUES / ENTRIES
export function keys(obj) {
    const keys = meta_meths.get(obj.constructor.name);
    if (keys) {
        return keys;
    }
    return [];
}
export function values(obj) {
    const vals = [];
    const keys = meta_meths.get(obj.constructor.name);
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
    const keys = meta_meths.get(obj.constructor.name);
    if (!keys) {
        return entries;
    }
    keys.forEach((key) => {
        entries.push([key, obj[key]]);
    });
    return entries;
}
//# sourceMappingURL=meta.js.map