/**
 * Handle absolut path which are tsconfig-like
 * eg. with baseUrl and paths keys
 */
import { join as join_path } from "path";
import fs_extra from "fs-extra";
import { Json_File } from "../../../../files/Json_File";
import { escape_special_characters } from "../../../../../both/types/regex/string";
/**
 * Do read_config(file_path) then paths_to_regexes()
 */
export async function load_config(file_path) {
    return read_config(file_path).then((config) => {
        return paths_to_regexes(config);
    });
}
export async function read_config(file_path) {
    const file = new Json_File({
        full_path: file_path,
    });
    return file.read_keys(["baseUrl", "paths"]).then((json) => {
        return {
            base_url: join_path(file.path, json.baseUrl),
            paths: json.paths,
        };
    });
}
const asterisk_reg = /\*/g;
/**
 * Generate iAbsolut_Paths_Config.paths_regexes
 * from the specified  iAbsolut_Paths_Config.paths
 *
 * @return paths_config which now have 2 more keys
 *                      (or whose 2 keys have been replaced):
 *                          paths_regexes
 *                          paths_union_regex
 */
export function paths_to_regexes(paths_config) {
    const { paths } = paths_config;
    paths_config.regexes_to_paths = {};
    let paths_union_regex_str;
    let bNot_first_iter;
    //
    // === paths_regexes
    {
        for (const path of paths) {
            //
            // Replace asterisks by '.+'
            // then escape special characters
            const reg_str = escape_special_characters(paths[path].replace(asterisk_reg, ".+"));
            //
            // Append reg_str to paths_union_regex_str
            {
                if (bNot_first_iter) {
                    paths_union_regex_str += "|" + reg_str;
                }
                else {
                    bNot_first_iter = true;
                    paths_union_regex_str = reg_str;
                }
            }
            paths_config.regexes_to_paths[path] = reg_str;
        }
    }
    //
    // === paths_union_regex
    {
        paths_config.paths_union_regex = new RegExp(paths_union_regex_str);
    }
    return paths_config;
}
function check_config_regexes(paths_config) {
    if (!paths_config.regexes_to_paths || !paths_config.paths_union_regex) {
        throw new TypeError("The specified paths_config{iAbsolut_Paths_Config} is missing keys regexes_to_paths and/or paths_union_regex.\nHave you called paths_to_regexes(paths_config : iAbsolut_Paths_Config) first ?");
    }
}
/**
 * Check if the specified path is an absolut one
 * in the specified config
 * paths_regexes/paths_union_regex must be set in paths_config
 *
 * @param path
 * @param paths_config
 */
export function is_absolut_path(path, paths_config) {
    //
    // Check preconds
    {
        //
        // Throw TypeError if any missing regexes keys in paths_config
        check_config_regexes(paths_config);
    }
    return paths_config.paths_union_regex.test(path);
}
export function get_absolut_path(path, paths_config) {
    //
    // Check preconds
    {
        //
        // Throw TypeError if any missing regexes keys in paths_config
        check_config_regexes(paths_config);
    }
    const matches = paths_config.paths_union_regex.test(path);
    {
        if (!matches) {
            throw new SyntaxError("Path " +
                path +
                " does not start with an absolut path from the specified iAbsolut_Paths_Config config : \n" +
                to_string(paths_config));
        }
    }
    //
    //TODO Matching above returns all characters from path
    // (not just a regexes_to_paths' key)
    // because of the .+ regex wilcard
    const requested_absolut_path = paths_config.regexes_to_paths[matches[0]];
    const linked_paths = paths_config.paths[requested_absolut_path];
    //
    // Look for the linked path owning a file/dir
    // matching the path argument
    {
        for (let i = 0; i < linked_paths.length; i++) {
            const absolut_path = join_path(paths_config.base_url, linked_paths[i]);
            if (fs_extra.pathExistsSync(absolut_path)) {
                return absolut_path;
            }
        }
    }
    throw new ReferenceError("Path " +
        path +
        " does not match any existing file with absolut path " +
        requested_absolut_path +
        " in iAbsolut_Paths_Config config : \n" +
        to_string(paths_config));
}
export function to_string(paths_config) {
    let str = "Base url : " + paths_config.base_url + "\nPaths :\n";
    for (const absolut_path of paths_config.paths) {
        str += "\t" + absolut_path + " : \n";
        for (const linked_path of paths_config.paths[absolut_path]) {
            str += "\t\t" + linked_path + "\n";
        }
    }
    return str;
}
//# sourceMappingURL=absolut_path.js.map