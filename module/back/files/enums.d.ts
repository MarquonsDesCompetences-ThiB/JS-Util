/**
 * https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_file_system_flags
 */
export declare enum eMode {
    /**
     * 'a': Open file for appending.
     *      The file is created if it does not exist.
     */
    APPEND = 0,
    /**
     * 'ax': Like 'a' but fails if the path exists.
     */
    APPEND_EXISTING = 1,
    /**
     * 'as': Open file for appending in synchronous mode.
     *       The file is created if it does not exist.
     */
    APPEND_SYNC = 2,
    /**
     * 'a+': Open file for reading and appending.
     *       The file is created if it does not exist.
     */
    READ_APPEND = 3,
    /**
     * 'ax+': Like 'a+' but fails if the path exists.
     */
    READ_APPEND_EXISTING = 4,
    /**
     * 'as+': Open file for reading and appending in synchronous mode.
     *        The file is created if it does not exist.
     */
    READ_APPEND_SYNC = 5,
    /**
     * 'r': Open file for reading.
     *      An exception occurs if the file does not exist.
     */
    READ_EXISTING = 6,
    /**
     * 'r+': Open file for reading and writing.
     *       An exception occurs if the file does not exist.
     */
    READ_WRITE_EXISTING = 7,
    /**
     * 'rs+': Open file for reading and writing in synchronous mode.
     *        Instructs the operating system to bypass the local file system cache.
     *
     *        This is primarily useful for opening files on NFS mounts as it allows skipping the potentially stale local cache. It has a very real impact on I/O performance so using this flag is not recommended unless it is needed.
     *        This doesn't turn fs.open() or fsPromises.open() into a synchronous blocking call. If synchronous operation is desired, something like fs.openSync() should be used.
     */
    READ_WRITE_EXISTING_SYNC = 8,
    /**
     * 'w+': Open file for reading and writing.
     *       The file is created (if it does not exist) or truncated (if it exists).
     */
    READ_WRITE = 9,
    /**
     * 'wx+': Like 'w+' but fails if the path exists.
     */
    READ_WRITE_NEW = 10,
    /**
     * 'w': Open file for writing.
     *      The file is created (if it does not exist) or truncated (if it exists).
     */
    WRITE = 11,
    /**
     * 'wx': Like 'w' but fails if the path exists.
     */
    WRITE_NEW = 12
}
export declare function to_mode_letters(mode_flag: eMode): "a" | "ax" | "as" | "a+" | "ax+" | "as+" | "r" | "r+" | "rs+" | "w+" | "wx+" | "w" | "wx";
