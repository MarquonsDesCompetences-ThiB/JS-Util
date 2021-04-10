import { eMode } from "./enums.js";
import { File_props } from "./_props/File_props.js";
/**
 *
 */
export declare class File extends File_props {
    constructor(obj?: any);
    /**
     *
     * https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_fspromises_open_path_flags_mode
     * http://man7.org/linux/man-pages/man2/open.2.html
     *
     * @returns
     */
    open(mode?: eMode, use_stream?: boolean): Promise<File>;
    open_stream(mode?: eMode): Promise<File>;
    close(): Promise<boolean>;
    /**
     *
     * @param {File} other_file
     *
     * @return {Promise}
     */
    merge_file(other_file: any): Promise<any>;
    clone(): File;
    toJSON(): {
        path: string;
        name: string;
        ext: string;
        content: string | any[][];
    };
    /**
     *
     * @param {File} other_file
     *
     * @return {Promise}
     */
    merge(other_file: any): Promise<any>;
    read_sequential(): Promise<any>;
    /**
     *
     * @return {Promise}  Success: {string|string[]|object} content
     *                    Reject: {string} err
     */
    read(): Promise<string | any | (string | number)[][]>;
    /**
     * Return the requested row by directly reading the file
     * Result not stored in this.content
     *
     * @param {integer} row_id
     * @param {integer | string | undefined} sheet_id_or_name
     *                                        For xlsx files
     *                                        Sheet's id or name
     *                                        Removing/adding sheets make
     *                                        their id not to stay ordered
     *                                        in 1.. !
     *                                        =>sheet 1 might not exist but 2
     * @return {*[]} Row content
     */
    read_row(row_id: number): string | any[];
    /**
     *
     * @param{number} cursor_fileHandle If set, use a file handle :
     *                                     fs.write is directly used
     *                                     If value is a negative number,
     *                                     the cursor is not moved
     *                                     Move the cursor to the specified
     *                                     position otherwise
     *
     *                                  If not set, use a WriteStream :
     *                                  => we have to wait for the
     *                                    writing promise
     *                                  If previously used, will always be used
     *                                  whatever is the cursor_fileHandle value
     *                                  as long as the stream is not closed
     *
     *                                  WriteStream: https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_fs_createwritestream_path_options
     *
     * @return {Promise}  Success
     *                    Reject: {string} err
     */
    write(data?: any, cursor_fileHandle?: number): Promise<number>;
    /**
     * ppend the specified data to the file
     * @param data
     */
    append(data: any, options?: any): Promise<void>;
    /**
     * Flush the writing
     */
    flush(): Promise<void>;
    /**
     * Apply this.output_updates => write file
     *
     * @return {Promise}
     *                  Success: {integer} Nb elements udpated
     *                                    xlsx : Nb cells
     */
    apply_updates(): Promise<any>;
    /**
     * @return {Promise} Cf. this.apply_updates
     */
    release(): Promise<any>;
    set error(ex: string | Error);
    set info(msg: string);
    set log(msg: string);
    set trace(msg: string);
    set warn(msg: string);
}
