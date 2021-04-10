export function empty_Results() {
    return {
        nb: 0,
        success: 0,
        fails: 0,
    };
}
export function add_Results(result_in_out, result_in) {
    result_in_out.nb += result_in.nb;
    result_in_out.success += result_in.success;
    result_in_out.fails += result_in.fails;
    return result_in_out;
}
//# sourceMappingURL=iResults.js.map