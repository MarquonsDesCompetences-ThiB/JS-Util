export const even_str = `\d*[02468]`;
export const odd_str = `\d*[13579]`;
//
// === LESS THAN X ===
function units_less_than_digit(digit) {
    //
    // Check preconds
    {
        if (digit > 9) {
            throw Error("Digit argument must be an unique digit (in [0;9])");
        }
    }
    let str = "[";
    for (let i = 0; i < digit; i++) {
        str += i;
    }
    return str + "]";
}
export function less_than(x) {
    let units = x;
    let nb_max_digits = 0;
    //
    // Fetch nb max of first digits (all but units)
    // and x's units
    {
        let x_tmp = Math.ceil(units / 10);
        while (x_tmp > 0) {
            nb_max_digits++;
            units = x_tmp;
            x_tmp = Math.ceil(x_tmp / 10);
        }
    }
    //
    // Construct the regex string
    {
        //
        // If only 1 digit
        {
            if (!nb_max_digits) {
                return units_less_than_digit(units);
            }
        }
        //
        // Else up to nb_max_digits whatever digits
        // + 1 digit <unit(x)
        return `[\d{${nb_max_digits}}${units_less_than_digit(units)}]`;
    }
}
//
// === GREATER THAN X ===
function units_greater_than_digit(digit) {
    //
    // Check preconds
    {
        if (digit > 9) {
            throw Error("Digit argument must be an unique digit (in [0;9])");
        }
    }
    let str = "[";
    for (let i = digit + 1; i < 10; i++) {
        str += i;
    }
    return str + "]";
}
export function greater_than(x) {
    let units = x;
    let nb_min_digits = 0;
    //
    // Fetch nb max of first digits (all but units)
    // and x's units
    {
        let x_tmp = Math.ceil(units / 10);
        while (x_tmp > 0) {
            nb_min_digits++;
            units = x_tmp;
            x_tmp = Math.ceil(x_tmp / 10);
        }
    }
    //
    // Construct the regex string
    {
        //
        // If only 1 digit
        {
            if (!nb_min_digits) {
                return units_greater_than_digit(units);
            }
        }
        //
        // Else from nb_max_digits+1 whatever digits
        // OR nb_max_digits and 1 digit >unit(x)
        return `[\d{${nb_min_digits + 1},}|\d{${nb_min_digits}}${units_greater_than_digit(units)}]`;
    }
}
//# sourceMappingURL=numbers.js.map