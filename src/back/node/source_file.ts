import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 *
 * @param meta From Node's import variable
 */
export function get_file_name({ meta }) {
  return fileURLToPath(meta.url);
}

export function get_dir_name(file_name: string) {
  return dirname(file_name);
}

interface File_Names {
  file_name: string;
  dir_name: string;
}

export function get_file_names({ meta }): File_Names {
  const file_name = get_file_name(meta);
  return {
    file_name,
    dir_name: get_dir_name(file_name),
  };
}
