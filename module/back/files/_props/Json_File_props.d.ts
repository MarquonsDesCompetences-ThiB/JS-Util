import { File } from "../_files.js";
export declare abstract class Json_File_props extends File {
    #private;
    get content(): any;
    set content(content: any);
    /**
     * Return the number of items in files (if read)
     * Can be a number of :
     * objects (json files)
     */
    get nb(): number;
}
