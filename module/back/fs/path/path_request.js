export function get_path_request(path) {
    const ret = {
        /**
         * True if path starts with an all wildcard (**) and has others dirs/files following it
         */
        bAll_wildcard: false,
        entry_to_find_reg: undefined,
        bEntry_to_find_is_dir: undefined,
        bIterate_subdirs: undefined,
    };
    if (path) {
        if (path[0] === "**") {
            ret.bAll_wildcard = true;
            ret.entry_to_find_reg = new RegExp("^" + path[1] + "$");
            ret.bEntry_to_find_is_dir = path.length > 2;
        }
        else {
            ret.entry_to_find_reg = new RegExp("^" + path[0] + "$");
            ret.bEntry_to_find_is_dir = path.length > 1;
        }
        ret.bIterate_subdirs =
            ret.bEntry_to_find_is_dir &&
                // path[1] could be empty if slash only used
                // to specify path[0] is a directory (bEntry_is_dir)
                path[1] !== "";
    }
    else {
        ret.bIterate_subdirs = true;
    }
    return ret;
}
//# sourceMappingURL=path_request.js.map