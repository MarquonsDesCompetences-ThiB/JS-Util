/**
 * Associate class names to their properties declared as enumerable
 * with the decorator @enumerable
 */
const not_enum_props = new Map();
/**
 * Declare and store a cyclic class' property
 *
 * @param target class the object is an instance of
 * @param key property name to set as cyclic
 */
export function enumerable(target, key) {
    const class_name = target.constructor.name;
    const class_stored = not_enum_props.has(class_name);
    const props = class_stored ? not_enum_props.get(class_name) : [];
    props.push(key);
    //
    // Store the array if not already in cyclic_props
    {
        if (!class_stored) {
            not_enum_props.set(class_name, props);
        }
    }
}
//
// === KEYS / VALUES / ENTRIES
export function keys(obj) {
    return not_enum_props.get(obj.constructor.name);
}
export function values(obj) {
    const vals = [];
    const keys = not_enum_props.get(obj.constructor.name);
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
    const keys = not_enum_props.get(obj.constructor.name);
    if (!keys) {
        return entries;
    }
    keys.forEach((key) => {
        entries.push([key, obj[key]]);
    });
    return entries;
}
//# sourceMappingURL=enumerable.js.map