import { even_str as even_numbers, odd_str as odd_numbers, less_than, greater_than, } from "./numbers";
//
// === REGEXES ===
const regex_delimiter = `:`;
const escaped_regex_delimiter = `\\${regex_delimiter}`;
const regexes = {
    string_regex: new RegExp(
    // any character between delimiters, non-greedy
    `(${escaped_regex_delimiter})(.+?)(${escaped_regex_delimiter})`, "g"),
    numbers: {
        conditions: {
            less_than: new RegExp(tString_regex_identifier_reg `<(\d+)`, "g"),
            greater_than: new RegExp(tString_regex_identifier_reg `>(\d+)`, "g"),
        },
        operations: {
            modulo_2: new RegExp(tString_regex_identifier_reg `(%2=[01])`, "g"),
            modulo_2_0: new RegExp(tString_regex_identifier_reg `(%2=0)`, "g"),
            modulo_2_1: new RegExp(tString_regex_identifier_reg `(%2=1)`, "g"),
        },
    },
    wildcards: {
        all: new RegExp(tString_regex_identifier_reg `(*)`, "g"),
    },
};
export function tString_regex(strings, regex_str) {
    if (regex_str) {
        return `${regex_delimiter}${regex_str}${regex_delimiter}`;
    }
    return `${regex_delimiter}${strings[0]}${regex_delimiter}`;
}
/**
 * Tag function for creating regex with identifier
 *  Add identifier RegExpr in parenthesis scope
 *  => parenthesis scopes from strings[0] start at 2
 *
 * @param strings[0] The regex expression which have - or not - an identifier
 */
export function tString_regex_identifier_reg(strings, regex_str) {
    if (regex_str) {
        return `(?<=[^\\])${escaped_regex_delimiter}([\w_\d]*)${regex_str}(?<=[^\\])${escaped_regex_delimiter}`;
    }
    return `(?<=[^\\])${escaped_regex_delimiter}([\w_\d]*)${strings[0]}(?<=[^\\])${escaped_regex_delimiter}`;
}
/**
 * To parse strings containing an expression to switch to RegExp
 * This kind of string must includes a RegEx with |<regex>|
 * To escape the vertical bar, precede it with a backslash
 *
 * A regexable part is :
 *    :[<id>] <|>|% <value>:
 *    :[<id>]*:
 *
 * 'All wildcard' are replaced by their RegExpr equivalent '.'
 *  Others are replaced by their RegExpr equivalent surounded by columns ':'
 *
 * @param reg_str
 * @param out_regex_vals
 */
export default function parse(reg_str, out_regex_vals) {
    reg_str = parse_numbers_expressions(reg_str, out_regex_vals);
    reg_str = parse_wildcards(reg_str, out_regex_vals);
    return reg_str;
}
/**
 * Same as parse(...) but returning an array splitted by '.'
 * Every string element containing a RegExp is converted to RegExp
 *
 * @param reg_str
 * @param out_regex_vals?
 */
export function parse_accessor(reg_str, out_regex_vals) {
    const parsed_str = parse(reg_str, out_regex_vals);
    const has_reg = regexes.string_regex;
    const strs = parsed_str.split(`\.`);
    strs.forEach((str, idx) => {
        if (has_reg.test(str)) {
            //
            // remove regex delimiters+convert string to RegExp
            strs[idx] = new RegExp(str.replace(has_reg, "$2"));
        }
    });
    return strs;
}
/**
 * Parse numbers forumlas in regex string to convert them
 * to a RegExp compatible digits form
 *
 * %2=0 : even numbers
 * %2=1 : odd numbers
 *
 * <x : numbers less than x
 * >x : numbers greater than x
 *
 * @param regex_vals If set, every mathematical expression can have
 *                        a preceding identifier [\w_\d]*.
 *                        regex_vals is fulfilled with them,
 *                        in order they appear in reg_str.
 *                        Ones which have no identifier have one set to their
 *                        id in regex_vals
 */
export function parse_numbers_expressions(reg_str, regex_vals) {
    const str = _parse_numbers_expressions(reg_str, regex_vals);
    //
    // Sort preceding names (regex_ids_pos) if they're requested
    // and fills regex_ids wih
    {
        if (regex_vals) {
            sort_complete_regex_values(regex_vals);
        }
    }
    return str;
}
/**
 * Parse single all wildcard '*' to be replaced
 * by their RegExp's equivalent '.'
 *
 * Dots in reg_str which have not a preceding backslash first get one
 * not to be confused with the RegExp's all wildcard
 *
 * @param reg_str
 */
export function parse_wildcards(reg_str, regex_vals, not_escape_dots) {
    const str = not_escape_dots
        ? reg_str
        : // Add backslash to dots which are not preceded by one
            reg_str.replace(/(?<=[^\\])\./, `\.`);
    const reg = regexes.wildcards.all;
    if (regex_vals) {
        const matches = str.match(reg);
        if (!matches) {
            return str;
        }
        regex_vals.concat(get_regex_values(matches, reg));
    }
    //
    // Replace every all wildcards '*' by the RegExp's all wildcard '.'
    return str.replace(reg, `${regex_delimiter}.${regex_delimiter}`);
}
/**
 *
 * @param reg_str
 * @param regex_ids_pos To sort all preceding names by their index in reg_str
 *
 * @return string with expressions replaced
 *                by RegExp compatible ones between columns
 *                Ex.:
 *                    my_string:\w+:_goes_on
 */
function _parse_numbers_expressions(reg_str, regex_ids_pos) {
    let str = reg_str;
    //
    // <x
    {
        const reg = regexes.numbers.conditions.less_than;
        const matches = str.match(reg);
        if (matches) {
            // extract id/regex parts
            const vals = get_regex_values(matches, reg);
            vals.forEach((id_elmt) => {
                const number = Number.parseInt(id_elmt.value);
                str = str.replace(reg, tString_regex `${less_than(number)}`);
            });
            if (regex_ids_pos) {
                regex_ids_pos.concat(vals);
            }
        }
    }
    //
    // >x
    {
        const reg = regexes.numbers.conditions.greater_than;
        const matches = str.match(reg);
        if (matches) {
            // extract id/regex parts
            const vals = get_regex_values(matches, reg);
            vals.forEach((id_elmt) => {
                const number = Number.parseInt(id_elmt.value);
                str = str.replace(reg, tString_regex `${greater_than(number)}`);
            });
            if (regex_ids_pos) {
                regex_ids_pos.concat(vals);
            }
        }
    }
    //
    // %2=[0|1]
    {
        const reg = regexes.numbers.operations.modulo_2;
        const matches = str.match(reg);
        if (matches) {
            // extract id/regex parts
            // and fill regex_ids_pos (if any in arguments)
            const vals = get_regex_values(matches, reg);
            if (regex_ids_pos) {
                regex_ids_pos.concat(vals);
            }
            // even numbers
            str = str.replace(regexes.numbers.operations.modulo_2_0, even_numbers);
            // odd numbers
            str = str.replace(regexes.numbers.operations.modulo_2_1, odd_numbers);
        }
    }
    return str;
}
/**
 * For each string in matches, return its identifier
 *
 * @param matches Strings containing a regex expression
 * @param regex Regex for identifier regex with at least 2 scopes
 */
function get_regex_values(matches, regex) {
    const vals = [];
    matches.forEach((str, idx) => {
        //
        // Extract id and regex
        let parts = str.replace(regex, "$1|$2");
        if (!parts) {
            logger.error =
                "Could not extract identifier and regex expression from " +
                    str +
                    " with regex " +
                    regex;
            return;
        }
        //
        // Split id and regex
        parts = parts.split("|");
        {
            if (!parts || parts.length < 2) {
                logger.error =
                    "No identifier and regex extracted from " +
                        str +
                        " with regex " +
                        regex;
                return;
            }
            if (parts.length > 2) {
                logger.warn =
                    "More than 2 parts extracted as identifier and regex from " +
                        str +
                        " with regex " +
                        regex +
                        " :\n\t[" +
                        parts.join(", ") +
                        "].\n\tOnly the two 1st will be used.";
            }
        }
        vals.push({
            idx,
            id: parts[0],
            value: parts[1],
        });
    });
    return vals;
}
/**
 * Sort elements in regex_vals by their idx (ascending order)
 * and complete missing id by the element's index in regex_vals
 * @param regex_vals
 */
function sort_complete_regex_values(regex_vals) {
    //
    // Sort by ascending idx
    regex_vals.sort((name_pos1, name_pos2) => {
        return name_pos1.idx - name_pos2.idx;
    });
    //
    // Set id to values which have no one
    regex_vals.forEach((name_pos, idx) => {
        if (name_pos.id.length === 0) {
            name_pos.id = "" + idx;
        }
    });
}
//# sourceMappingURL=parse.js.map