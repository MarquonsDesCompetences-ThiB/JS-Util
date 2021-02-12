import { Csv_File_props } from "./_props/Csv_File_props.js";
export declare class Csv_File extends Csv_File_props {
    /**
     * Return the column letter following col_letter
     * Columns letters use the sheets order, eg A, B,...Z,AA,AB,...AZ,AAA...
     * @param {string} col_letters
     *
     * @return {string}
     */
    static next_column_letters(col_letters?: string): string;
    constructor(obj?: any);
    add_col_name(col_name: string): number;
    /**
     * Init this.col_names with this.content[0]
     */
    first_row_to_col_names(): void;
    /**
     * Convert json content to double dimensions Array csv content and
     * set it to this.content
     *
     * @return {integer} Number of rows (including first row : columns names)
     */
    add_json_content(json: any): number;
    /**
     * Convert this.content to array
     */
    to_csv_array(): string[][];
    to_csv_string(): any;
    /**
     * Init this.values_associations[column_id] setting keys from values
     * of this.content[i][column_id]
     *
     * @param {integer [0;this.content[i].length-1]} column_id
     *
     * @return {integer} Number of keys
     */
    init_values_association_column(column_id: number): number;
    construct_dom_column_select(select_name?: string, select_id?: string): any;
}
