export interface iPath_Request {
    bAll_wildcard: boolean;
    entry_to_find_reg: RegExp | undefined;
    bEntry_to_find_is_dir: boolean;
    bIterate_subdirs: boolean;
}
export declare function get_path_request(path?: string | string[]): iPath_Request;
