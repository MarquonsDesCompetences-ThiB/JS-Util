/**
 * Associate class names to their properties declared as
 * having a "jsonifying method"
 * with the decorator @jsonified
 */
const jsonified_props = new Map<string, string[]>();

/**
 * Declare and store a cyclic class' property
 *
 * @param target class the object is an instance of
 * @param key property name to set as cyclic
 */
export function jsonified(target: any, key) {
  const class_name = target.constructor.name;
  const class_stored = jsonified_props.has(class_name);

  const props = class_stored ? jsonified_props.get(class_name) : [];
  props.push(key);

  //
  // Store the array if not already in jsonified_props
  {
    if (!class_stored) {
      jsonified_props.set(class_name, props);
    }
  }
}

//
// === KEYS / VALUES / ENTRIES
export function keys(obj: any) {
  const keys = jsonified_props.get(obj.constructor.name);
  if (keys) {
    return keys;
  }

  return [];
}

export function values(obj: any) {
  const vals = [];

  const keys = jsonified_props.get(obj.constructor.name);
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

  const keys = jsonified_props.get(obj.constructor.name);
  if (!keys) {
    return entries;
  }

  keys.forEach((key) => {
    entries.push([key, obj[key]]);
  });

  return entries;
}
