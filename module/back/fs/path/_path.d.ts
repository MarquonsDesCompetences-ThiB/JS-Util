export * as request from "./path_request.js";
export * as split from "./split.js";
export * as util from "./util.js";
/**
 * Return the delimiter (/ or \\) used in the specified path
 * @param path
 */
export declare function delimiter(path: string): "/" | "\\";
/**
 * Convert the specified path to a regex :
 *  - escape '/', '\' and '.' characters
 *  - leave '**' as is
 *  - convert '*' to '.'
 * @param path
 */
export declare function path_to_regex(path: string): string;
/**
 * Postcond :
 *  typeof path = string
 *  path.length>0
 *  || path[0]="**" and path.length>1
 *
 * @param path
 */
export declare function sanitize_regex_path(path: string | string[]): string[] | undefined;
