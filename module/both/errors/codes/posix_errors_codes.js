/**
 * From https://nodejs.org/api/os.html#os_error_constants
 */
/**
 * Returns the meaning of the specified error code as a string
 *
 * @param code Either the enum code or its string form
 */
export function get_str(code) {
    if (code) {
        return posix[code];
    }
    return posix[ePosix[code]];
}
export var ePosix;
(function (ePosix) {
    ePosix[ePosix["E2BIG"] = 0] = "E2BIG";
    ePosix[ePosix["EACCES"] = 1] = "EACCES";
    ePosix[ePosix["EADDRINUSE"] = 2] = "EADDRINUSE";
    ePosix[ePosix["EADDRNOTAVAIL"] = 3] = "EADDRNOTAVAIL";
    ePosix[ePosix["EAFNOSUPPORT"] = 4] = "EAFNOSUPPORT";
    ePosix[ePosix["EAGAIN"] = 5] = "EAGAIN";
    ePosix[ePosix["EALREADY"] = 6] = "EALREADY";
    ePosix[ePosix["EBADF"] = 7] = "EBADF";
    ePosix[ePosix["EBADMSG"] = 8] = "EBADMSG";
    ePosix[ePosix["EBUSY"] = 9] = "EBUSY";
    ePosix[ePosix["ECANCELED"] = 10] = "ECANCELED";
    ePosix[ePosix["ECHILD"] = 11] = "ECHILD";
    ePosix[ePosix["ECONNABORTED"] = 12] = "ECONNABORTED";
    ePosix[ePosix["ECONNREFUSED"] = 13] = "ECONNREFUSED";
    ePosix[ePosix["ECONNRESET"] = 14] = "ECONNRESET";
    ePosix[ePosix["EDEADLK"] = 15] = "EDEADLK";
    ePosix[ePosix["EDESTADDRREQ"] = 16] = "EDESTADDRREQ";
    ePosix[ePosix["EDOM"] = 17] = "EDOM";
    ePosix[ePosix["EDQUOT"] = 18] = "EDQUOT";
    ePosix[ePosix["EEXIST"] = 19] = "EEXIST";
    ePosix[ePosix["EFAULT"] = 20] = "EFAULT";
    ePosix[ePosix["EFBIG"] = 21] = "EFBIG";
    ePosix[ePosix["EHOSTUNREACH"] = 22] = "EHOSTUNREACH";
    ePosix[ePosix["EIDRM"] = 23] = "EIDRM";
    ePosix[ePosix["EILSEQ"] = 24] = "EILSEQ";
    ePosix[ePosix["EINPROGRESS"] = 25] = "EINPROGRESS";
    ePosix[ePosix["EINTR"] = 26] = "EINTR";
    ePosix[ePosix["EINVAL"] = 27] = "EINVAL";
    ePosix[ePosix["EIO"] = 28] = "EIO";
    ePosix[ePosix["EISCONN"] = 29] = "EISCONN";
    ePosix[ePosix["EISDIR"] = 30] = "EISDIR";
    ePosix[ePosix["ELOOP"] = 31] = "ELOOP";
    ePosix[ePosix["EMFILE"] = 32] = "EMFILE";
    ePosix[ePosix["EMLINK"] = 33] = "EMLINK";
    ePosix[ePosix["EMSGSIZE"] = 34] = "EMSGSIZE";
    ePosix[ePosix["EMULTIHOP"] = 35] = "EMULTIHOP";
    ePosix[ePosix["ENAMETOOLONG"] = 36] = "ENAMETOOLONG";
    ePosix[ePosix["ENETDOWN"] = 37] = "ENETDOWN";
    ePosix[ePosix["ENETRESET"] = 38] = "ENETRESET";
    ePosix[ePosix["ENETUNREACH"] = 39] = "ENETUNREACH";
    ePosix[ePosix["ENFILE"] = 40] = "ENFILE";
    ePosix[ePosix["ENOBUFS"] = 41] = "ENOBUFS";
    ePosix[ePosix["ENODATA"] = 42] = "ENODATA";
    ePosix[ePosix["ENODEV"] = 43] = "ENODEV";
    ePosix[ePosix["ENOENT"] = 44] = "ENOENT";
    ePosix[ePosix["ENOEXEC"] = 45] = "ENOEXEC";
    ePosix[ePosix["ENOLCK"] = 46] = "ENOLCK";
    ePosix[ePosix["ENOLINK"] = 47] = "ENOLINK";
    ePosix[ePosix["ENOMEM"] = 48] = "ENOMEM";
    ePosix[ePosix["ENOMSG"] = 49] = "ENOMSG";
    ePosix[ePosix["ENOPROTOOPT"] = 50] = "ENOPROTOOPT";
    ePosix[ePosix["ENOSPC"] = 51] = "ENOSPC";
    ePosix[ePosix["ENOSR"] = 52] = "ENOSR";
    ePosix[ePosix["ENOSTR"] = 53] = "ENOSTR";
    ePosix[ePosix["ENOSYS"] = 54] = "ENOSYS";
    ePosix[ePosix["ENOTCONN"] = 55] = "ENOTCONN";
    ePosix[ePosix["ENOTDIR"] = 56] = "ENOTDIR";
    ePosix[ePosix["ENOTEMPTY"] = 57] = "ENOTEMPTY";
    ePosix[ePosix["ENOTSOCK"] = 58] = "ENOTSOCK";
    ePosix[ePosix["ENOTSUP"] = 59] = "ENOTSUP";
    ePosix[ePosix["ENOTTY"] = 60] = "ENOTTY";
    ePosix[ePosix["ENXIO"] = 61] = "ENXIO";
    ePosix[ePosix["EOPNOTSUPP"] = 62] = "EOPNOTSUPP";
    ePosix[ePosix["EOVERFLOW"] = 63] = "EOVERFLOW";
    ePosix[ePosix["EPERM"] = 64] = "EPERM";
    ePosix[ePosix["EPIPE"] = 65] = "EPIPE";
    ePosix[ePosix["EPROTO"] = 66] = "EPROTO";
    ePosix[ePosix["EPROTONOSUPPORT"] = 67] = "EPROTONOSUPPORT";
    ePosix[ePosix["EPROTOTYPE"] = 68] = "EPROTOTYPE";
    ePosix[ePosix["ERANGE"] = 69] = "ERANGE";
    ePosix[ePosix["EROFS"] = 70] = "EROFS";
    ePosix[ePosix["ESPIPE"] = 71] = "ESPIPE";
    ePosix[ePosix["ESRCH"] = 72] = "ESRCH";
    ePosix[ePosix["ESTALE"] = 73] = "ESTALE";
    ePosix[ePosix["ETIME"] = 74] = "ETIME";
    ePosix[ePosix["ETIMEDOUT"] = 75] = "ETIMEDOUT";
    ePosix[ePosix["ETXTBSY"] = 76] = "ETXTBSY";
    ePosix[ePosix["EWOULDBLOCK"] = 77] = "EWOULDBLOCK";
    ePosix[ePosix["EXDEV"] = 78] = "EXDEV";
})(ePosix || (ePosix = {}));
export const posix = {
    [ePosix.E2BIG]: "Indicates that the list of arguments is longer than expected.",
    [ePosix.EACCES]: "Indicates that the operation did not have sufficient permissions.",
    [ePosix.EADDRINUSE]: "Indicates that the network address is already in use.",
    [ePosix.EADDRNOTAVAIL]: "Indicates that the network address is currently unavailable for use.",
    [ePosix.EAFNOSUPPORT]: "Indicates that the network address family is not supported.",
    [ePosix.EAGAIN]: "Indicates that there is no data available and to try the operation again later.",
    [ePosix.EALREADY]: "Indicates that the socket already has a pending connection in progress.",
    [ePosix.EBADF]: "Indicates that a file descriptor is not valid.",
    [ePosix.EBADMSG]: "Indicates an invalid data message.",
    [ePosix.EBUSY]: "Indicates that a device or resource is busy.",
    [ePosix.ECANCELED]: "Indicates that an operation was canceled.",
    [ePosix.ECHILD]: "Indicates that there are no child processes.",
    [ePosix.ECONNABORTED]: "Indicates that the network connection has been aborted.",
    [ePosix.ECONNREFUSED]: "Indicates that the network connection has been refused.",
    [ePosix.ECONNRESET]: "Indicates that the network connection has been reset.",
    [ePosix.EDEADLK]: "Indicates that a resource deadlock has been avoided.",
    [ePosix.EDESTADDRREQ]: "Indicates that a destination address is required.",
    [ePosix.EDOM]: "Indicates that an argument is out of the domain of the function.",
    [ePosix.EDQUOT]: "Indicates that the disk quota has been exceeded.",
    [ePosix.EEXIST]: "Indicates that the file already exists.",
    [ePosix.EFAULT]: "Indicates an invalid pointer address.",
    [ePosix.EFBIG]: "Indicates that the file is too large.",
    [ePosix.EHOSTUNREACH]: "Indicates that the host is unreachable.",
    [ePosix.EIDRM]: "Indicates that the identifier has been removed.",
    [ePosix.EILSEQ]: "Indicates an illegal byte sequence.",
    [ePosix.EINPROGRESS]: "Indicates that an operation is already in progress.",
    [ePosix.EINTR]: "Indicates that a function call was interrupted.",
    [ePosix.EINVAL]: "Indicates that an invalid argument was provided.",
    [ePosix.EIO]: "Indicates an otherwise unspecified I/O error.",
    [ePosix.EISCONN]: "Indicates that the socket is connected.",
    [ePosix.EISDIR]: "Indicates that the path is a directory.",
    [ePosix.ELOOP]: "Indicates too many levels of symbolic links in a path.",
    [ePosix.EMFILE]: "Indicates that there are too many open files.",
    [ePosix.EMLINK]: "Indicates that there are too many hard links to a file.",
    [ePosix.EMSGSIZE]: "Indicates that the provided message is too long.",
    [ePosix.EMULTIHOP]: "Indicates that a multihop was attempted.",
    [ePosix.ENAMETOOLONG]: "Indicates that the filename is too long.",
    [ePosix.ENETDOWN]: "Indicates that the network is down.",
    [ePosix.ENETRESET]: "Indicates that the connection has been aborted by the network.",
    [ePosix.ENETUNREACH]: "Indicates that the network is unreachable.",
    [ePosix.ENFILE]: "Indicates too many open files in the system.",
    [ePosix.ENOBUFS]: "Indicates that no buffer space is available.",
    [ePosix.ENODATA]: "Indicates that no message is available on the stream head read queue.",
    [ePosix.ENODEV]: "Indicates that there is no such device.",
    [ePosix.ENOENT]: "Indicates that there is no such file or directory.",
    [ePosix.ENOEXEC]: "Indicates an exec format error.",
    [ePosix.ENOLCK]: "Indicates that there are no locks available.",
    [ePosix.ENOLINK]: "Indications that a link has been severed.",
    [ePosix.ENOMEM]: "Indicates that there is not enough space.",
    [ePosix.ENOMSG]: "Indicates that there is no message of the desired type.",
    [ePosix.ENOPROTOOPT]: "Indicates that a given protocol is not available.",
    [ePosix.ENOSPC]: "Indicates that there is no space available on the device.",
    [ePosix.ENOSR]: "Indicates that there are no stream resources available.",
    [ePosix.ENOSTR]: "Indicates that a given resource is not a stream.",
    [ePosix.ENOSYS]: "Indicates that a function has not been implemented.",
    [ePosix.ENOTCONN]: "Indicates that the socket is not connected.",
    [ePosix.ENOTDIR]: "Indicates that the path is not a directory.",
    [ePosix.ENOTEMPTY]: "Indicates that the directory is not empty.",
    [ePosix.ENOTSOCK]: "Indicates that the given item is not a socket.",
    [ePosix.ENOTSUP]: "Indicates that a given operation is not supported.",
    [ePosix.ENOTTY]: "Indicates an inappropriate I/O control operation.",
    [ePosix.ENXIO]: "Indicates no such device or address.",
    [ePosix.EOPNOTSUPP]: "Indicates that an operation is not supported on the socket. Although ENOTSUPand EOPNOTSUPP have the same value on Linux, according to POSIX.1 these error values should be distinct.)",
    [ePosix.EOVERFLOW]: "Indicates that a value is too large to be stored in a given data type.",
    [ePosix.EPERM]: "Indicates that the operation is not permitted.",
    [ePosix.EPIPE]: "Indicates a broken pipe.",
    [ePosix.EPROTO]: "Indicates a protocol error.",
    [ePosix.EPROTONOSUPPORT]: "Indicates that a protocol is not supported.",
    [ePosix.EPROTOTYPE]: "Indicates the wrong type of protocol for a socket.",
    [ePosix.ERANGE]: "Indicates that the results are too large.",
    [ePosix.EROFS]: "Indicates that the file system is read only.",
    [ePosix.ESPIPE]: "Indicates an invalid seek operation.",
    [ePosix.ESRCH]: "Indicates that there is no such process.",
    [ePosix.ESTALE]: "Indicates that the file handle is stale.",
    [ePosix.ETIME]: "Indicates an expired timer.",
    [ePosix.ETIMEDOUT]: "Indicates that the connection timed out.",
    [ePosix.ETXTBSY]: "Indicates that a text file is busy.",
    [ePosix.EWOULDBLOCK]: "Indicates that the operation would block.",
    [ePosix.EXDEV]: "Indicates an improper link.",
};
//# sourceMappingURL=posix_errors_codes.js.map