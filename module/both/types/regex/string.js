/**
 * Return as many indexes as regex matches.
 * Look for the regex pattern in string ; for each occurence, returns its index
 *
 * Equivalent to String.search but returning
 * as many indexes as the Regex exists in string
 *
 * @return {integer[]} With every integer in [0, str.length[
 */
export function search_multi(str, regex) {
    const idxs = [];
    const matches = str.match(regex);
    if (!matches) {
        return idxs;
    }
    let last_idx = -1;
    matches.forEach((str_val) => {
        const idx = str.indexOf(str_val, last_idx + 1 //not to include twice an occurence
        );
        if (idx >= 0) {
            idxs.push(idx);
            last_idx = idx;
        }
    });
    return idxs;
}
const reg_special_chars = /(\^|\$|\.|\*|\+|\?|\\|\/|\(|\)|\[|\]|\{|\})/g;
/**
 * Escape in the specified string
 * special characters which are meaningful in regexes
 * not to interpret them when building a RegExp from the string
 *
 * @param reg_str
 */
export function escape_special_characters(reg_str) {
    return reg_str.replace(reg_special_chars, "\\$1");
}
//# sourceMappingURL=string.js.map