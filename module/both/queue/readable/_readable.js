export { ReadableStream_WorkingQueue as Working_Queue } from "./ReadableStream_WorkingQueue.js";
import { createReadStream } from "fs";
import { obj } from "../../types/_types.js";
/**
 * https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options
 *
 * @param child_obj
 * @param path
 * @param opts
 */
export function create_fs_stream_child(child_obj, path, opts) {
    return obj.dynamic_extends(child_obj, createReadStream(path, opts));
}
//# sourceMappingURL=_readable.js.map