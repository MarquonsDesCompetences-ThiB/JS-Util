import { search_multi } from "./string.js";
/**
 * Return true if in in_string chars are nested into scopes chars
 * Scopes chars are :
 *  [ ]
 *  ( )
 *  { }
 *  ' '
 *  " "
 *  ` `
 *
 *
 * @param chars
 * @param in_string
 * @param all If true and in_string contains chars multiple times,
 *              return true if if all of them are nested
 *             If false, return true if any of them are nested
 */
export function nested(chars, in_string, all) {
    const chars_idx = search_multi(in_string, new RegExp(chars, "g"));
    if (!chars_idx) {
        return false;
    }
    const nested_chars_ids = [];
    //
    // NESTED IN TEXT SCOPES
    {
        const nested_chars_ids = nested_text_scope(chars_idx, in_string, all);
        if (!all && nested_chars_ids.length > 0) {
            return true;
        }
        else if (nested_chars_ids.length === chars_idx.length) {
            return true;
        }
    }
    //
    // NESTED IN CONTEXT SCOPES
    {
        nested_chars_ids.concat(nested_context_scope(chars_idx, in_string, all));
        if (!all && nested_chars_ids.length > 0) {
            return true;
        }
    }
    return nested_chars_ids.length === chars_idx.length;
}
export function nested_context_scope(chars_idx, in_string, all) {
    const nested_chars_ids = [];
    //
    // === BRACES
    {
        const starting_scope_idxs = search_multi(in_string, /\{/g);
        if (starting_scope_idxs) {
            const ending_scope_idxs = search_multi(in_string, /\}/g);
            const scope_idxs = to_1_depth_scopes_idxs(starting_scope_idxs, ending_scope_idxs);
            const res = check_nesteds(scope_idxs);
            //
            // At least one must be nested and have been found
            if (res) {
                return nested_chars_ids;
            }
        }
    }
    //
    // === BRACKETS
    {
        const starting_scope_idxs = search_multi(in_string, /\[/g);
        if (starting_scope_idxs) {
            const ending_scope_idxs = search_multi(in_string, /\]/g);
            const scope_idxs = to_1_depth_scopes_idxs(starting_scope_idxs, ending_scope_idxs);
            const res = check_nesteds(scope_idxs);
            //
            // At least one must be nested and have been found
            if (res) {
                return nested_chars_ids;
            }
        }
    }
    //
    // === PARENTHESIS
    {
        const starting_scope_idxs = search_multi(in_string, /\(/g);
        if (starting_scope_idxs) {
            const ending_scope_idxs = search_multi(in_string, /\)/g);
            const scope_idxs = to_1_depth_scopes_idxs(starting_scope_idxs, ending_scope_idxs);
            const res = check_nesteds(scope_idxs);
            //
            // At least one must be nested and have been found
            if (res) {
                return nested_chars_ids;
            }
        }
    }
    return nested_chars_ids;
    function to_1_depth_scopes_idxs(starting_scope_idxs, ending_scope_idxs) {
        const scopes_idxs = [];
        for (let i = 0; i < starting_scope_idxs.length; i++) {
            const start = starting_scope_idxs[i];
            scopes_idxs.push(start);
            //
            // Fetch the associate end tag
            {
                let end = ending_scope_idxs[i];
                let next_scope = i + 1;
                while (next_scope <= starting_scope_idxs.length &&
                    starting_scope_idxs[next_scope] < end) {
                    end = ending_scope_idxs[next_scope];
                    next_scope++;
                }
                scopes_idxs.push(end);
            }
        }
        return scopes_idxs;
    }
    function check_nesteds(scopes_idx) {
        chars_idx.forEach((idx, id) => {
            for (let i = 0; i < scopes_idx.length; i += 2) {
                if (idx >= scopes_idx[i] && idx <= scopes_idx[i + 1]) {
                    //
                    // Kepp track of nested chars idx
                    nested_chars_ids.push(id);
                    //
                    //At least one must be nested
                    if (!all) {
                        return true;
                    }
                }
            }
        });
        return undefined;
    }
}
export function nested_text_scope(chars_idx, in_string, all) {
    const nested_chars_ids = [];
    //
    // === QUOTES
    {
        const quotes_idx = search_multi(in_string, /\'/g);
        if (quotes_idx) {
            const res = check_nesteds(quotes_idx);
            //
            // At least one must be nested and have been found
            if (res) {
                return nested_chars_ids;
            }
        }
    }
    //
    // === DOUBLE-QUOTES
    {
        const quotes_idx = search_multi(in_string, /\"/g);
        if (quotes_idx) {
            const res = check_nesteds(quotes_idx);
            //
            // At least one must be nested and have been found
            if (res) {
                return nested_chars_ids;
            }
        }
    }
    //
    // === BACK QUOTE
    {
        const quotes_idx = search_multi(in_string, /\`/g);
        if (quotes_idx) {
            const res = check_nesteds(quotes_idx);
            //
            // At least one must be nested and have been found
            if (res) {
                return nested_chars_ids;
            }
        }
    }
    return nested_chars_ids;
    function check_nesteds(scopes_idx) {
        chars_idx.forEach((idx, id) => {
            for (let i = 0; i < scopes_idx.length; i += 2) {
                if (idx >= scopes_idx[i] && idx <= scopes_idx[i + 1]) {
                    //
                    // Kepp track of nested chars idx
                    nested_chars_ids.push(id);
                    //
                    //At least one must be nested
                    if (!all) {
                        return true;
                    }
                }
            }
        });
        return undefined;
    }
}
//# sourceMappingURL=nested.js.map