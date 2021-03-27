/**
 * Return the number of true flags in the specified one
 *
 * @param flags
 */
export function get_nb_flags(flags: number) {
  let nb = 0;

  while (flags) {
    if (flags & 1) {
      nb++;
    }

    flags >>= 1;
  }

  return nb;
}
