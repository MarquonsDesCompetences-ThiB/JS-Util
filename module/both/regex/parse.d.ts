/**
 * Parse numbers forumlas in regex string to convert them
 * to a RegExp compatible digits form
 *
 * %2=0 : even numbers
 * %2=1 : odd numbers
 *
 * <x : numbers less than x
 * >x : numbers greater than x
 *
 * @param preceding_names If set, every mathematical expression can have
 *                        a preceding name [\w_\d]*.
 *                        preceding_names is fulfilled with them,
 *                        in order they appear in reg_str.
 *                        Ones which have no preceding name are skipped
 *                        (no empty string is set to preceding_names).
 */
export declare function parse_numbers_expressions(reg_str: string, preceding_names?: string[]): string;
/**
 * Parse single all wildcard '*' to be replaced
 * by their RegExp's equivalent '.'
 *
 * Dots in reg_str which have not a preceding backslash first get one
 * not to be confused with the RegExp's all wildcard
 *
 * @param reg_str
 */
export declare function parse_wildcards(reg_str: string): string;
