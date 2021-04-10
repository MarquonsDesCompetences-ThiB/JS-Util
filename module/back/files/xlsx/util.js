export const colors = {
    black: {
        argb: "FFFFFFFF",
    },
    blue: {
        argb: "FF0000FF",
    },
    green: {
        argb: "FF00FF00",
    },
    red: {
        argb: "FFFF0000",
    },
    white: {
        argb: "FF000000",
    },
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
export function cell_ids_to_alphanum(col_id, row_id) {
    return column_id_to_letters(col_id) + row_id;
}
/**
 * Convert the specified column number to its letter(s) equivalent
 *
 * @param {int} col_id
 * @param {int} exp Internal use for recursivity
 *                  Exponential to apply to 26
 *
 * @return {string}
 */
export function column_id_to_letters(col_id, exp = 0) {
    let id = col_id, letters = "";
    //
    // Recursive call if next exponential is lower than id
    {
        const exp_incr = exp + 1;
        if (Math.pow(26, exp_incr) < id) {
            const res = column_id_to_letters(col_id, exp_incr);
            id = res.id;
            letters = res.letters;
        }
    }
    //
    // Computation of caller's id to use and letter of this generation
    {
        const gen_pow = Math.pow(26, exp);
        const next_id = Math.ceil(id / gen_pow);
        // ASCII : A=65, ..., Z=90
        letters = letters + String.fromCharCode((id % gen_pow) + 64);
        //
        // 1st call => returns only letters
        if (exp === 0) {
            return letters;
        }
        //
        // else returns data needed by callers
        else {
            return {
                id,
                letters,
            };
        }
    }
}
//# sourceMappingURL=util.js.map