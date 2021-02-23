import { elmt as array_elmt } from "../array/_array";
export declare function tString_regex(strings: any, regex_str?: any): string;
/**
 * Tag function for creating regex with identifier
 *  Add identifier RegExpr in parenthesis scope
 *  => parenthesis scopes from strings[0] start at 2
 *
 * @param strings[0] The regex expression which have - or not - an identifier
 */
export declare function tString_regex_identifier_reg(strings: any, regex_str?: any): string;
/**
 * To parse strings containing an expression to switch to RegExp
 * This kind of string must includes a RegEx with |<regex>|
 * To escape the vertical bar, precede it with a backslash
 *
 * A regexable part is :
 *    :[<id>] <|>|% <value>:
 *    :[<id>]*:
 *
 * 'All wildcard' are replaced by their RegExpr equivalent '.'
 *  Others are replaced by their RegExpr equivalent surounded by columns ':'
 */
export declare function parse(reg_str: string, out_regex_vals?: array_elmt.iIdentified_Elmt<string, string>[]): string;
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
 * @param regex_vals If set, every mathematical expression can have
 *                        a preceding identifier [\w_\d]*.
 *                        regex_vals is fulfilled with them,
 *                        in order they appear in reg_str.
 *                        Ones which have no identifier have one set to their
 *                        id in regex_vals
 */
export declare function parse_numbers_expressions(reg_str: string, regex_vals?: array_elmt.iIdentified_Elmt<string, string>[]): string;
/**
 * Parse single all wildcard '*' to be replaced
 * by their RegExp's equivalent '.'
 *
 * Dots in reg_str which have not a preceding backslash first get one
 * not to be confused with the RegExp's all wildcard
 *
 * @param reg_str
 */
export declare function parse_wildcards(reg_str: string, regex_vals?: array_elmt.iIdentified_Elmt<string, string>[]): string;
