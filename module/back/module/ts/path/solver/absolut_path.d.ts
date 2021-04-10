export interface iAbsolut_Paths_Config {
    /**
     * Base url of all paths
     */
    base_url: string;
    paths: any;
    /**
     * Values are the keys from paths
     * Keys are their regex string equivalent
     */
    regexes_to_paths?: any;
    /**
     * A regex doing the union
     * of all regexes_to_paths' keys
     */
    paths_union_regex?: RegExp;
}
/**
 * Do read_config(file_path) then paths_to_regexes()
 */
export declare function load_config(file_path: string): Promise<iAbsolut_Paths_Config>;
export declare function read_config(file_path: string): Promise<iAbsolut_Paths_Config>;
/**
 * Generate iAbsolut_Paths_Config.paths_regexes
 * from the specified  iAbsolut_Paths_Config.paths
 *
 * @return paths_config which now have 2 more keys
 *                      (or whose 2 keys have been replaced):
 *                          paths_regexes
 *                          paths_union_regex
 */
export declare function paths_to_regexes(paths_config: iAbsolut_Paths_Config): iAbsolut_Paths_Config;
/**
 * Check if the specified path is an absolut one
 * in the specified config
 * paths_regexes/paths_union_regex must be set in paths_config
 *
 * @param path
 * @param paths_config
 */
export declare function is_absolut_path(path: string, paths_config: iAbsolut_Paths_Config): boolean;
export declare function get_absolut_path(path: string, paths_config: iAbsolut_Paths_Config): string;
export declare function to_string(paths_config: iAbsolut_Paths_Config): string;
