/**
 * Associate class names to their properties declared as enumerable
 * with the decorator @enum
 */
const jsonify_props = new Map<string, string[]>();

/**
 * Declare and store a cyclic class' property
 *
 * @param target class the object is an instance of
 * @param key property name to set as cyclic
 * @param descriptor property’s descriptor object
 */
export function jsonify(target: any, key, descriptor) {
  const class_name = target.constructor.name;
  const class_stored = jsonify_props.has(class_name);

  const props = class_stored ? jsonify_props.get(class_name) : [];
  props.push(key);

  //
  // Store the array if not already in cyclic_props
  {
    if (!class_stored) {
      jsonify_props.set(class_name, props);
    }
  }

  return descriptor;
}

//
// === KEYS / VALUES / ENTRIES
export function keys(obj: any) {
  return jsonify_props.get(obj.constructor.name);
}

export function values(obj: any) {
  const vals = [];

  const keys = jsonify_props.get(obj.constructor.name);
  if (!keys) {
    return vals;
  }

  keys.forEach((key) => {
    vals.push(obj[key]);
  });

  return vals;
}

export function entries(obj: any): [string, any][] {
  const entries = [];

  const keys = jsonify_props.get(obj.constructor.name);
  if (!keys) {
    return entries;
  }

  keys.forEach((key) => {
    entries.push([key, obj[key]]);
  });

  return entries;
}