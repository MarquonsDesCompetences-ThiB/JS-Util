export * as request from "./path_request.js";
export * as split from "./split.js";
export * as util from "./util.js";

import { string } from "@both_types/_types.js";

/**
 * Return the delimiter (/ or \\) used in the specified path
 * @param path
 */
export function delimiter(path: string) {
  return /\//.test(path) ? "/" : "\\";
}

/**
 * Convert the specified path to a regex :
 *  - escape '/', '\' and '.' characters
 *  - leave '**' as is
 *  - convert '*' to '.'
 * @param path
 */
export function path_to_regex(path: string) {
  //escape '/', '\' and '.' characters
  path = path.replace(/(\\|\/|\.)/g, "\\$1");
  //convert '*' to '.' avoiding '**'
  path = path.replace(/(?<=[^\*])\*(?=[^\*])/g, ".");

  return path;
}

/**
 * Postcond :
 *  typeof path = string
 *  path.length>0
 *  || path[0]="**" and path.length>1
 *
 * @param path
 */
export function sanitize_regex_path(
  path: string | string[]
): string[] | undefined {
  if (path == null) {
    return undefined;
  }

  //
  // Convert path to string[] if is a string
  {
    if (string.is(path)) {
      //
      // Split by slash or backslash
      if (/\//.test(<string>path)) {
        path = (<string>path).split("/");
      } else {
        path = (<string>path).split("\\");
      }
    }
  }

  switch (path.length) {
    case 0:
      return undefined;

    case 1:
      //
      // Only "**" in path <=> all files
      if (path[0] === "**") {
        return undefined;
      }
      break;
  }

  return <string[]>path;
}
