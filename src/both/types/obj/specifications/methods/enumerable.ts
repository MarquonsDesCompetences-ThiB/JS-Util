/**
 * Associate class names to their methods declared as enumerable
 * with the decorator @enum,
 * to be able to retrieve them in specifics circumstances
 * despite of their descriptor specifies enumerable = false
 */
const not_enums_meths = new Map<string, string[]>();

/**
 * Declare and store an enumerable class' method,
 * which is not enumerable following its descriptor
 *
 * @param target class the object is an instance of
 * @param key property name to set as enumerable
 */
export function enumerable(target: any, key) {
  const class_name = target.constructor.name;
  const class_stored = not_enums_meths.has(class_name);

  const props = class_stored ? not_enums_meths.get(class_name) : [];
  props.push(key);

  //
  // Store the array if not already in not_enums_meths
  {
    if (!class_stored) {
      not_enums_meths.set(class_name, props);
    }
  }
}

//
// === KEYS / VALUES / ENTRIES
export function keys(obj: any) {
  const keys = not_enums_meths.get(obj.constructor.name);
  if (keys) {
    return keys;
  }

  return [];
}

export function values(obj: any) {
  const vals = [];

  const keys = not_enums_meths.get(obj.constructor.name);
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

  const keys = not_enums_meths.get(obj.constructor.name);
  if (!keys) {
    return entries;
  }

  keys.forEach((key) => {
    entries.push([key, obj[key]]);
  });

  return entries;
}
