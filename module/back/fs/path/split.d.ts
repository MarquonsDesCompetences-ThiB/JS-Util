/**
 * Functions returning the :
 *  - OS' temporary directory (tmp_dir_path)
 *  - user's directory (user_dir_path)
 */
export { tmpdir as tmp_dir_path, homedir as user_dir_path } from "os";
export interface iFull_Name {
    name: string;
    ext: string;
}
export declare function to_full_name(full_name: iFull_Name): string;
export declare function full_name(full_name: string): iFull_Name;
export interface iFull_Path extends iFull_Name {
    path: string;
}
export declare function to_full_path(full_path: iFull_Path): string;
export declare function full_path(full_path: string): iFull_Path;
export declare function path(path: string): string[];
