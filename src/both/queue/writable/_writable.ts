import { createWriteStream } from "fs";
import { obj } from "@both_types/_types.js";

/**
 * https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options
 *
 * @param child_obj
 * @param path
 * @param opts
 */
export function create_fs_stream_child(child_obj, path: string, opts?: any) {
  return obj.dynamic_extends(child_obj, createWriteStream(path, opts));
}
