import { File_props } from "./_props/File_props.js";
/**
 *
 */
export declare class File extends File_props {
    constructor(obj?: any);
    /**
     *
     * @param {File} other_file
     *
     * @return {Promise}
     */
    merge_file(other_file: any): Promise<unknown>;
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
    merge(other_file: any): Promise<unknown>;
    read_sequential(): Promise<unknown>;
    /**
     *
     * @return {Promise}  Success: {string|string[]|object} content
     *                    Reject: {string} err
     */
    read(): Promise<unknown>;
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
     * @return {Promise}  Success
     *                    Reject: {string} err
     */
    write(data?: any): Promise<void>;
    /**
     * Apply this.output_updates => write file
     *
     * @return {Promise}
     *                  Success: {integer} Nb elements udpated
     *                                    xlsx : Nb cells
     */
    apply_updates(): Promise<number>;
    /**
     * @return {Promise} Cf. this.apply_updates
     */
    release(): Promise<number>;
}
