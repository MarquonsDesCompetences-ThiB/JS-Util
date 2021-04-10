/// <reference types="node" />
import { obj } from "../../../both/types/_types.js";
import { eMode } from "../enums";
import * as fs from "fs";
export declare abstract class File_props extends obj.Obj {
    #private;
    /**
     * Default is READ_EXISTING ('r')
     * https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_fspromises_open_path_flags_mode
     */
    protected _mode: eMode;
    /**
     * File handle
     * https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_class_filehandle
     */
    protected file_handle: fs.promises.FileHandle;
    /**
     * Write stream
     * https://nodejs.org/dist/latest-v15.x/docs/api/stream.html#stream_class_stream_writable
     */
    protected write_stream: fs.WriteStream;
    get is_open(): boolean;
    get is_closed(): boolean;
    get mode(): eMode;
    get content(): string | any[][];
    set content(content: string | any[][]);
    set append_content(data: string);
    get ext(): string;
    set ext(ext: string);
    /**
     * === Full name : name + .ext ===
     */
    get full_name(): string;
    /**
     * Parse the specified name to split name and extension
     */
    set full_name(full_name: string);
    /**
     * === Full path : full_name + path ===
     */
    get full_path(): string;
    /**
     * Parse the specified path to split directories path,
     * file's name and extension
     */
    set full_path(full_path: string);
    get name(): string;
    set name(name: string);
    get path(): string;
    set path(path: string);
    /**
     * Return the number of items in files (if read)
     * Can be a number of :
     * objects (json files),
     * characters (string files),
     * rows (excel file or converted to array)
     */
    get nb(): any;
    set nb(nb: any);
    /**
     * Updates to apply in file
     */
    protected output_updates: Object;
}
