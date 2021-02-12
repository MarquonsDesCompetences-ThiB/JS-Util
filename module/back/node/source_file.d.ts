/**
 *
 * @param meta From Node's import variable
 */
export declare function get_file_name({ meta }: {
    meta: any;
}): string;
export declare function get_dir_name(file_name: string): string;
interface File_Names {
    file_name: string;
    dir_name: string;
}
export declare function get_file_names({ meta }: {
    meta: any;
}): File_Names;
export {};
