import { Xlsx_File_props } from "./_props/Xlsx_File_props.js";
/**
 * Supports .xlsx (Excel) files
 */
export declare class Xlsx_File extends Xlsx_File_props {
    constructor(obj?: any);
    /**
     *
     * @param {function} cbk
     * @param {boolean | integer | optional} read_as_text|sheet_id
     *                                        read_as_text :
     *                                          If file must be read as string,
     *                                          not as json
     *                                        sheet_id :
     *                                          For xlsx files, the sheet to read
     *
     * @return {Promise}  Success: {string|string[]|object} content
     *                    Reject: {string} err
     */
    read(bLoad_content?: boolean, sheet_id_or_name?: string | String | number | Number): Promise<unknown>;
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
     * @return {*[]} Row content by column
     */
    read_row(row_id: number, sheet_id_or_name?: number | string | Number | String): any;
    /**
     *
     * @param {integer | string | undefined} sheet_id_or_name
     *                                        For xlsx files
     *                                        Sheet's id or name
     *                                        Removing/adding sheets make
     *                                        their id not to stay ordered
     *                                        in 1.. !
     *                                        =>sheet 1 might not exist but 2
     * @return {Promise}  Success
     *                    Reject: {string} err
     */
    write(sheet_id_or_name?: number | string | Number | String): Promise<void>;
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
