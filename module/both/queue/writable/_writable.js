import * as obj from "../../obj/_obj.js";
import { createWriteStream } from "fs";
/**
 * https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options
 *
 * @param child_obj
 * @param path
 * @param opts
 */
export function create_fs_stream_child(child_obj, path, opts) {
    return obj.dynamic_extends(child_obj, createWriteStream(path, opts));
}
//# sourceMappingURL=_writable.js.map