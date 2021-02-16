export * as posix from "./posix_errors_codes.js";
export * as windows from "./windows_errors_codes.js";

import { ePosix, get_str as get_str_posix } from "./posix_errors_codes.js";
import {
  eWindows,
  get_str as get_str_windows,
} from "./windows_errors_codes.js";

/**
 * Returns the meaning of the specifified platform's error code as a string
 *
 * @param code Either the enum code or its string form
 */
export function get_str(
  code: ePosix | eWindows | keyof typeof ePosix | keyof typeof eWindows
): string {
  if ((code as ePosix) || ePosix[code]) {
    return get_str_posix(<ePosix | keyof typeof ePosix>code);
  }

  return get_str_windows(<eWindows | keyof typeof eWindows>code);
}
