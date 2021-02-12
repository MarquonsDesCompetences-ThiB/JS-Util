import { fileURLToPath } from "url";
import { dirname } from "path";
/**
 *
 * @param meta From Node's import variable
 */
export function get_file_name({ meta }) {
    return fileURLToPath(meta.url);
}
export function get_dir_name(file_name) {
    return dirname(file_name);
}
export function get_file_names({ meta }) {
    const file_name = get_file_name(meta);
    return {
        file_name,
        dir_name: get_dir_name(file_name),
    };
}
//# sourceMappingURL=source_file.js.map