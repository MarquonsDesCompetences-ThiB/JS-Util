/**
 * Return all values in obj having the specified keys
 *
 * @param obj
 * @param keys
 * @returns
 */
export function values(obj: any, keys: string[]): string[] {
  const vals = [];

  keys.forEach((key) => {
    vals.push(obj[key]);
  });

  return vals;
}

/**
 * Return all couples [key, value] in obj
 * with every key being in the specified keys array
 *
 * @param obj
 * @param keys
 * @returns
 */
export function entries(obj: any, keys: string[]): [string, any][] {
  const entries = [];

  keys.forEach((key) => {
    entries.push([key, obj[key]]);
  });

  return entries;
}
