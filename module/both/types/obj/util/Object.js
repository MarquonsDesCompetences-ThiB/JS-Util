/**
 * Return all values in obj having the specified keys
 *
 * @param obj
 * @param keys
 * @returns
 */
export function values(obj, keys) {
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
export function entries(obj, keys) {
    const entries = [];
    keys.forEach((key) => {
        entries.push([key, obj[key]]);
    });
    return entries;
}
//# sourceMappingURL=Object.js.map