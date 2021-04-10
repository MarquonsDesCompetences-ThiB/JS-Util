/**
 * Return true if in in_string chars are nested into scopes chars
 * Scopes chars are :
 *  [ ]
 *  ( )
 *  { }
 *  ' '
 *  " "
 *  ` `
 *
 *
 * @param chars
 * @param in_string
 * @param all If true and in_string contains chars multiple times,
 *              return true if if all of them are nested
 *             If false, return true if any of them are nested
 */
export declare function nested(chars: string, in_string: string, all?: boolean): boolean;
export declare function nested_context_scope(chars_idx: number[], in_string: string, all?: boolean): number[];
export declare function nested_text_scope(chars_idx: number[], in_string: string, all?: boolean): number[];
