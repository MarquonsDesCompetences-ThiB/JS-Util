/**
 * https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_file_system_flags
 */
export enum eMode {
  /**
   * 'a': Open file for appending.
   *      The file is created if it does not exist.
   */
  APPEND,
  /**
   * 'ax': Like 'a' but fails if the path exists.
   */
  APPEND_EXISTING,

  /**
   * 'as': Open file for appending in synchronous mode.
   *       The file is created if it does not exist.
   */
  APPEND_SYNC,

  /**
   * 'a+': Open file for reading and appending.
   *       The file is created if it does not exist.
   */
  READ_APPEND,
  /**
   * 'ax+': Like 'a+' but fails if the path exists.
   */
  READ_APPEND_EXISTING,

  /**
   * 'as+': Open file for reading and appending in synchronous mode.
   *        The file is created if it does not exist.
   */
  READ_APPEND_SYNC,

  /**
   * 'r': Open file for reading.
   *      An exception occurs if the file does not exist.
   */
  READ_EXISTING,

  /**
   * 'r+': Open file for reading and writing.
   *       An exception occurs if the file does not exist.
   */
  READ_WRITE_EXISTING,

  /**
   * 'rs+': Open file for reading and writing in synchronous mode.
   *        Instructs the operating system to bypass the local file system cache.
   *
   *        This is primarily useful for opening files on NFS mounts as it allows skipping the potentially stale local cache. It has a very real impact on I/O performance so using this flag is not recommended unless it is needed.
   *        This doesn't turn fs.open() or fsPromises.open() into a synchronous blocking call. If synchronous operation is desired, something like fs.openSync() should be used.
   */
  READ_WRITE_EXISTING_SYNC,

  /**
   * 'w+': Open file for reading and writing.
   *       The file is created (if it does not exist) or truncated (if it exists).
   */
  READ_WRITE,

  /**
   * 'wx+': Like 'w+' but fails if the path exists.
   */
  READ_WRITE_NEW,

  /**
   * 'w': Open file for writing.
   *      The file is created (if it does not exist) or truncated (if it exists).
   */
  WRITE,

  /**
   * 'wx': Like 'w' but fails if the path exists.
   */
  WRITE_NEW,
}

export function to_mode_letters(mode_flag: eMode) {
  if (mode_flag == null) {
    return undefined;
  }

  switch (mode_flag) {
    case eMode.APPEND:
      return "a";

    case eMode.APPEND_EXISTING:
      return "ax";

    case eMode.APPEND_SYNC:
      return "as";

    case eMode.READ_APPEND:
      return "a+";

    case eMode.READ_APPEND_EXISTING:
      return "ax+";

    case eMode.READ_APPEND_SYNC:
      return "as+";

    case eMode.READ_EXISTING:
      return "r";

    case eMode.READ_WRITE_EXISTING:
      return "r+";

    case eMode.READ_WRITE_EXISTING_SYNC:
      return "rs+";

    case eMode.READ_WRITE:
      return "w+";

    case eMode.READ_WRITE_NEW:
      return "wx+";

    case eMode.WRITE:
      return "w";

    case eMode.WRITE_NEW:
      return "wx";
  }

  throw new TypeError("Unknown mode " + mode_flag);
}
