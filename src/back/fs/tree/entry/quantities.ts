import {
  iResults,
  empty_Results,
  add_Results,
} from "@src/both/interfaces/_interfaces.js";

//
// === iNb_Entries ===
export interface iNb_Entries {
  dirs: number;
  files: number;
}

export function empty_Nb_Entries(): iNb_Entries {
  return {
    dirs: 0,
    files: 0,
  };
}

export function add_Nb_Entries(
  entries_inOut: iNb_Entries,
  entries_in: iNb_Entries
): iNb_Entries {
  entries_inOut.dirs += entries_in.dirs;
  entries_inOut.files += entries_in.files;

  return entries_inOut;
}

//
// === iNb_Entries_Results ===
export interface iNb_Entries_Results {
  dirs: iResults;
  files: iResults;
}

export function empty_Nb_Entries_Results(): iNb_Entries_Results {
  return {
    dirs: empty_Results(),
    files: empty_Results(),
  };
}

export function add_Nb_Entries_Results(
  entries_inOut: iNb_Entries_Results,
  entries_in: iNb_Entries_Results
): iNb_Entries_Results {
  add_Results(entries_inOut.dirs, entries_in.dirs);
  add_Results(entries_inOut.files, entries_in.files);

  return entries_inOut;
}
