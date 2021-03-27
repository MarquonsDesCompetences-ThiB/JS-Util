/**
 * Format the array or stringed array to string
 * by adding the specified delimited_char
 * after every comma and opening bracket
 *
 * @param arr_str
 */
export function array(
  arr: string | [],
  delimiter_char: string = "\r\n"
): string {
  const arr_str: string = arr instanceof Array ? JSON.stringify(arr) : arr;

  return arr_str.replace(/(\[|,)/g, "$1" + delimiter_char);
}
