/**
 * Return as many indexes as regex matches.
 * Look for the regex pattern in string ; for each occurence, returns its index
 *
 * Equivalent to String.search but returning
 * as many indexes as the Regex exists in string
 *
 * @return {integer[]} With every integer in [0, str.length[
 */
export declare function search_multi(str: string, regex: RegExp): number[];
/**
 * Escape in the specified string
 * special characters which are meaningful in regexes
 * not to interpret them when building a RegExp from the string
 *
 * @param reg_str
 */
export declare function escape_special_characters(reg_str: string): string;
