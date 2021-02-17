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
export function path_to_regex(path) {
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
export function sanitize_regex_path(path) {
    //
    // Convert path to string[] if is a string
    {
        if (path) {
            //
            // Split by slash or backslash
            if (/\//.test(path)) {
                path = path.split("/");
            }
            else {
                path = path.split("\\");
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
    return path;
}
//# sourceMappingURL=fs.js.map