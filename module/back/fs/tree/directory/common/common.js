/**
 * Get a map of subdirs' trees and files,
 * as map whose keys are the full_path
 */
export function get_map(directory_tree, full_parent_path, recursive) {
    //
    // Sanitize arguments
    {
        if (!full_parent_path) {
            full_parent_path = directory_tree.path;
        }
        else {
            full_parent_path += "/" + directory_tree.name;
        }
    }
    const map = new Map();
    //
    // Add subdirs
    {
        if (directory_tree.dirs) {
            directory_tree.dirs.forEach((dir_tree, name) => {
                map.set(full_parent_path + "/" + name, dir_tree);
            });
        }
    }
    //
    // Add files
    {
        if (directory_tree.files) {
            directory_tree.files.forEach((file_entry, name) => {
                map.set(full_parent_path + "/" + name, file_entry);
            });
        }
    }
    //
    // If recursive map requested
    {
        if (recursive && directory_tree.dirs) {
            directory_tree.dirs.forEach((dir_tree) => {
                const submap = dir_tree.get_map(full_parent_path, recursive);
                submap.forEach((subdir_tree, full_path) => {
                    map.set(full_path, subdir_tree);
                });
            });
        }
    }
    return map;
}
//# sourceMappingURL=common.js.map