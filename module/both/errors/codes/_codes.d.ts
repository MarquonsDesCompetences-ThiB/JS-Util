export * as posix from "./posix_errors_codes.js";
export * as windows from "./windows_errors_codes.js";
import { ePosix } from "./posix_errors_codes.js";
import { eWindows } from "./windows_errors_codes.js";
/**
 * Returns the meaning of the specifified platform's error code as a string
 *
 * @param code Either the enum code or its string form
 */
export declare function get_str(code: ePosix | eWindows | keyof typeof ePosix | keyof typeof eWindows): string;
