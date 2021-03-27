export interface iResults {
  nb: number;
  success: number;
  fails: number;
}

export function empty_Results(): iResults {
  return {
    nb: 0,
    success: 0,
    fails: 0,
  };
}

export function add_Results(
  result_in_out: iResults,
  result_in: iResults
): iResults {
  result_in_out.nb += result_in.nb;
  result_in_out.success += result_in.success;
  result_in_out.fails += result_in.fails;

  return result_in_out;
}
