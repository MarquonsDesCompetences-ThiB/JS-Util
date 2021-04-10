/**
 * Format the array or stringed array to string
 * by adding the specified delimited_char
 * after every comma and opening bracket
 *
 * @param arr_str
 */
export function array(arr, delimiter_char = "\r\n") {
    const arr_str = arr instanceof Array ? JSON.stringify(arr) : arr;
    return arr_str.replace(/(\[|,)/g, "$1" + delimiter_char);
}
//# sourceMappingURL=format.js.map