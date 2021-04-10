//
// === FILES EXTENSIONS ===
export function get_ext(file_name: string): string {
  if (!file_name) {
    return undefined;
  }

  const dot_idx = file_name.lastIndexOf(".");
  if (dot_idx < 0) {
    return undefined;
  }

  return file_name.slice(dot_idx + 1);
}

export function remove_ext(file_path: string): string {
  if (!file_path) {
    return undefined;
  }

  const dot_idx = file_path.lastIndexOf(".");
  if (dot_idx < 0) {
    return file_path;
  }

  return file_path.slice(0, dot_idx);
}

//
// === FILES NAMES ===
export function get_name(file_name: string): string {
  if (!file_name) {
    return undefined;
  }

  const dot_idx = file_name.lastIndexOf(".");
  if (dot_idx < 0) {
    return file_name;
  }

  return file_name.slice(0, dot_idx);
}

//
// === FILES PATH ===
export function get_path(file_path: string): string {
  if (!file_path) {
    return undefined;
  }

  const last_slash_idx = /\//.test(file_path)
    ? //unix delimiter
      file_path.lastIndexOf("/")
    : //windows delimiter
      file_path.lastIndexOf("\\\\");

  if (last_slash_idx < 0) {
    return undefined;
  }

  return file_path.slice(0, last_slash_idx);
}
