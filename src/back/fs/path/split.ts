import { join as join_path, sep as os_path_delimiter } from "path";

/**
 * Functions returning the :
 *  - OS' temporary directory (tmp_dir_path)
 *  - user's directory (user_dir_path)
 */
export { tmpdir as tmp_dir_path, homedir as user_dir_path } from "os";

//
// === iFull_Name
export interface iFull_Name {
  name: string;
  ext: string;
}

export function to_full_name(full_name: iFull_Name): string {
  return full_name.name + "." + full_name.ext;
}

export function full_name(full_name: string): iFull_Name {
  if (!full_name) {
    return {
      name: undefined,
      ext: undefined,
    };
  }

  const dot_idx = full_name.lastIndexOf(".");
  if (dot_idx < 0) {
    return {
      name: full_name,
      ext: undefined,
    };
  }

  return {
    name: full_name.slice(0, dot_idx),
    ext: full_name.slice(dot_idx + 1),
  };
}

//
// === iFull_Path
export interface iFull_Path extends iFull_Name {
  path: string;
}

export function to_full_path(full_path: iFull_Path): string {
  return join_path(full_path.path, to_full_name(full_path));
}

export function full_path(full_path: string): iFull_Path {
  if (!full_path) {
    return {
      name: undefined,
      ext: undefined,
      path: undefined,
    };
  }

  const last_slash_idx = /\//.test(full_path)
    ? //unix delimiter
      full_path.lastIndexOf("/")
    : //windows delimiter
      full_path.lastIndexOf("\\\\");

  if (last_slash_idx < 0) {
    const path_parts: any = full_name(full_path);
    path_parts.path = undefined;
    return path_parts;
  }

  const path_parts: any = full_name(full_path.slice(last_slash_idx + 1));
  path_parts.path = full_path.slice(0, last_slash_idx);
  return path_parts;
}

export function path(path: string): string[] {
  if (/\//.test(path)) {
    return path.split("/");
  }

  return path.split("\\\\");
}
