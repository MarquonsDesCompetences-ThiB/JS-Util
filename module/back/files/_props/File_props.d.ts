import { obj } from "../../../both/_both.js";
export declare abstract class File_props extends obj.Obj {
    #private;
    get content(): string | any[][];
    protected _content_set_: any;
    set content(content: string | any[][]);
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
