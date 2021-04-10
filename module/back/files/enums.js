/**
 * https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_file_system_flags
 */
export var eMode;
(function (eMode) {
    /**
     * 'a': Open file for appending.
     *      The file is created if it does not exist.
     */
    eMode[eMode["APPEND"] = 0] = "APPEND";
    /**
     * 'ax': Like 'a' but fails if the path exists.
     */
    eMode[eMode["APPEND_EXISTING"] = 1] = "APPEND_EXISTING";
    /**
     * 'as': Open file for appending in synchronous mode.
     *       The file is created if it does not exist.
     */
    eMode[eMode["APPEND_SYNC"] = 2] = "APPEND_SYNC";
    /**
     * 'a+': Open file for reading and appending.
     *       The file is created if it does not exist.
     */
    eMode[eMode["READ_APPEND"] = 3] = "READ_APPEND";
    /**
     * 'ax+': Like 'a+' but fails if the path exists.
     */
    eMode[eMode["READ_APPEND_EXISTING"] = 4] = "READ_APPEND_EXISTING";
    /**
     * 'as+': Open file for reading and appending in synchronous mode.
     *        The file is created if it does not exist.
     */
    eMode[eMode["READ_APPEND_SYNC"] = 5] = "READ_APPEND_SYNC";
    /**
     * 'r': Open file for reading.
     *      An exception occurs if the file does not exist.
     */
    eMode[eMode["READ_EXISTING"] = 6] = "READ_EXISTING";
    /**
     * 'r+': Open file for reading and writing.
     *       An exception occurs if the file does not exist.
     */
    eMode[eMode["READ_WRITE_EXISTING"] = 7] = "READ_WRITE_EXISTING";
    /**
     * 'rs+': Open file for reading and writing in synchronous mode.
     *        Instructs the operating system to bypass the local file system cache.
     *
     *        This is primarily useful for opening files on NFS mounts as it allows skipping the potentially stale local cache. It has a very real impact on I/O performance so using this flag is not recommended unless it is needed.
     *        This doesn't turn fs.open() or fsPromises.open() into a synchronous blocking call. If synchronous operation is desired, something like fs.openSync() should be used.
     */
    eMode[eMode["READ_WRITE_EXISTING_SYNC"] = 8] = "READ_WRITE_EXISTING_SYNC";
    /**
     * 'w+': Open file for reading and writing.
     *       The file is created (if it does not exist) or truncated (if it exists).
     */
    eMode[eMode["READ_WRITE"] = 9] = "READ_WRITE";
    /**
     * 'wx+': Like 'w+' but fails if the path exists.
     */
    eMode[eMode["READ_WRITE_NEW"] = 10] = "READ_WRITE_NEW";
    /**
     * 'w': Open file for writing.
     *      The file is created (if it does not exist) or truncated (if it exists).
     */
    eMode[eMode["WRITE"] = 11] = "WRITE";
    /**
     * 'wx': Like 'w' but fails if the path exists.
     */
    eMode[eMode["WRITE_NEW"] = 12] = "WRITE_NEW";
})(eMode || (eMode = {}));
export function to_mode_letters(mode_flag) {
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
//# sourceMappingURL=enums.js.map