import { empty_Results, add_Results, } from "../../../../both/interfaces/_interfaces.js";
export function empty_Nb_Entries() {
    return {
        dirs: 0,
        files: 0,
    };
}
export function add_Nb_Entries(entries_inOut, entries_in) {
    entries_inOut.dirs += entries_in.dirs;
    entries_inOut.files += entries_in.files;
    return entries_inOut;
}
export function empty_Nb_Entries_Results() {
    return {
        dirs: empty_Results(),
        files: empty_Results(),
    };
}
export function add_Nb_Entries_Results(entries_inOut, entries_in) {
    add_Results(entries_inOut.dirs, entries_in.dirs);
    add_Results(entries_inOut.files, entries_in.files);
    return entries_inOut;
}
//# sourceMappingURL=quantities.js.map