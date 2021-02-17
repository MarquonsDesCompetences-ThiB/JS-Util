import { Directory_Tree } from "./tree/Directory_Tree.js";
import { Directory_Tree_Root } from "./tree/Directory_Tree_Root.js";
import { Directory_Tree_Slave } from "./tree/slave/Directory_Tree_Slave.js";
export { Entry_Stats_intf } from "./tree/_props/Directory_Tree_props.js";
export declare const tree: {
    Master_Root: typeof Directory_Tree_Root;
    Master_Node: typeof Directory_Tree;
    Slave: typeof Directory_Tree_Slave;
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
