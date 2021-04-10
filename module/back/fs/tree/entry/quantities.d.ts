import { iResults } from "../../../../both/interfaces/_interfaces.js";
export interface iNb_Entries {
    dirs: number;
    files: number;
}
export declare function empty_Nb_Entries(): iNb_Entries;
export declare function add_Nb_Entries(entries_inOut: iNb_Entries, entries_in: iNb_Entries): iNb_Entries;
export interface iNb_Entries_Results {
    dirs: iResults;
    files: iResults;
}
export declare function empty_Nb_Entries_Results(): iNb_Entries_Results;
export declare function add_Nb_Entries_Results(entries_inOut: iNb_Entries_Results, entries_in: iNb_Entries_Results): iNb_Entries_Results;
