/**
 * Return as many indexes as regex matches.
 * Look for the regex pattern in string ; for each occurence, returns its index
 *
 * Equivalent to String.search but returning
 * as many indexes as the Regex exists in string
 *
 * @return {integer[]} With every integer in [0, str.length[
 */
export function search_multi(str: string, regex: RegExp): number[] {
  const idxs = [];

  const matches = str.match(regex);
  if (!matches) {
    return idxs;
  }

  let last_idx = -1;
  matches.forEach((str_val) => {
    const idx = str.indexOf(
      str_val,
      last_idx + 1 //not to include twice an occurence
    );
    if (idx >= 0) {
      idxs.push(idx);
      last_idx = idx;
    }
  });

  return idxs;
}
