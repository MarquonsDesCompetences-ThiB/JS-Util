export declare const colors: {
    black: {
        argb: string;
    };
    blue: {
        argb: string;
    };
    green: {
        argb: string;
    };
    red: {
        argb: string;
    };
    white: {
        argb: string;
    };
};
/**
 * Convert the specified column and row numbers
 * to its letter(s)+number equivalent
 * Ex. :
 *    1, 1 => A1
 *    1, 2 => A2
 *    ...
 *    2, 1 => B1
 *    2, 2 => B2
 *    ...
 *
 *
 * @param {int} col_id
 * @param {int} row_id
 *
 * @return {string}
 */
export declare function cell_ids_to_alphanum(col_id: number, row_id: number): string;
/**
 * Convert the specified column number to its letter(s) equivalent
 *
 * @param {int} col_id
 * @param {int} exp Internal use for recursivity
 *                  Exponential to apply to 26
 *
 * @return {string}
 */
export declare function column_id_to_letters(col_id: number, exp?: number): string | any;
