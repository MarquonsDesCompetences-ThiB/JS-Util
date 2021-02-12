import { File } from "../File.js";
export declare abstract class Csv_File_props extends File {
    nb_cols: number;
    col_names: string[];
    protected values_associations: Object;
}
