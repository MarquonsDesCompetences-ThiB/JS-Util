import {
  even_str as even_numbers,
  odd_str as odd_numbers,
  less_than,
  greater_than,
} from "./numbers";

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
 * @param preceding_names If set, every mathematical expression can have
 *                        a preceding name [\w_\d]*.
 *                        preceding_names is fulfilled with them,
 *                        in order they appear in reg_str.
 *                        Ones which have no preceding name are skipped
 *                        (no empty string is set to preceding_names).
 */
export function parse_numbers_expressions(
  reg_str: string,
  preceding_names?: string[]
): string {
  let str = reg_str;
  //
  // To sort all preceding names by their index in reg_str
  let preceding_names_pos = preceding_names ? [] : undefined;

  //
  // <x
  {
    const matches = str.match(/<(\d+)/g);
    if (matches) {
      get_preceding_names(/([\w_\d]*)<\d+/g);

      for (let i = 0; i < matches.length; i++) {
        const number = Number.parseInt(matches[i].slice(1));
        str.replace(/<\d+/, less_than(number));
      }
    }
  }

  //
  // >x
  {
    const matches = str.match(/>(\d+)/g);
    if (matches) {
      get_preceding_names(/([\w_\d]*)>\d+/g);

      for (let i = 0; i < matches.length; i++) {
        const number = Number.parseInt(matches[i].slice(1));
        str.replace(/>\d+/, greater_than(number));
      }
    }
  }

  //
  // %2
  {
    if (/%2=/.test(str)) {
      get_preceding_names(/([\w_\d]*)%2=/g);
    }

    //
    // %2=0
    {
      str = str.replace(/%2=0/g, even_numbers);
    }

    //
    // %2=1
    {
      str = str.replace(/%2=1/g, odd_numbers);
    }
  }

  //
  // Sort preceding names if they're requested
  {
    if (preceding_names) {
      preceding_names_pos.sort((name_pos1, name_pos2) => {
        return name_pos1.idx - name_pos2.idx;
      });

      preceding_names_pos.forEach((name_pos) => {
        preceding_names.push(name_pos.name);
      });
    }
  }

  function get_preceding_names(name_reg: RegExp) {
    if (!preceding_names) {
      return;
    }

    const names = reg_str.match(name_reg);
    const names_idx = reg_str.search(name_reg);
    if (names && names_idx) {
      for (let i = 0; i < names.length; i++) {
        preceding_names_pos.push({
          idx: names_idx[i],
          name: names[i],
        });
      }
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
export function parse_wildcards(reg_str: string): string {
  //
  // Add backslash to dots which have not one
  const str = reg_str.replace(/(?<=[^\\])\./, `\.`);

  //
  // Replace every all wildcards '*' by the RegExp's all wildcard '.'
  return str.replace(/(?<=[^\*])\*(?=[^\*])/, ".");
}
