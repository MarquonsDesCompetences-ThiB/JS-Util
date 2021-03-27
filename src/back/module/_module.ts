export * as from_cjs from "./Ems_from_Cjs.js";

import { fileURLToPath } from "url";
import { dirname } from "path";
export function get_root_dir_path() {
  //return dirname(fileURLToPath(import.meta.url));
  return process.env.INIT_CWD;
}
