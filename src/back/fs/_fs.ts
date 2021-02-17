export * from "./tree/Directory_Tree.js";

/**
 * Functions returning the :
 *  - OS' temporary directory (tmp_dir_path)
 *  - user's directory (user_dir_path)
 */
export { tmpdir as tmp_dir_path, homedir as user_dir_path } from "os";

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
