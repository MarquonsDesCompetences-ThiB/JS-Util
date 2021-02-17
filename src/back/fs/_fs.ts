import { Directory_Tree } from "./tree/Directory_Tree.js";
import { Directory_Tree_Root } from "./tree/Directory_Tree_Root.js";
import { Directory_Tree_Slave } from "./tree/slave/Directory_Tree_Slave.js";

export { Entry_Stats_intf } from "./tree/_props/Directory_Tree_props.js";

export const tree = {
  Master_Root: Directory_Tree_Root,
  Master_Node: Directory_Tree,
  Slave: Directory_Tree_Slave,
};

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
  //
  // Convert path to string[] if is a string
  {
    if (path as string) {
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
