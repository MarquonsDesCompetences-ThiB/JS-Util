/**
 * From https://nodejs.org/api/os.html#os_error_constants
 */
/**
 * Returns the meaning of the specified error code as a string
 *
 * @param code Either the enum code or its string form
 */
export declare function get_str(code: ePosix | keyof typeof ePosix): string;
export declare enum ePosix {
    E2BIG = 0,
    EACCES = 1,
    EADDRINUSE = 2,
    EADDRNOTAVAIL = 3,
    EAFNOSUPPORT = 4,
    EAGAIN = 5,
    EALREADY = 6,
    EBADF = 7,
    EBADMSG = 8,
    EBUSY = 9,
    ECANCELED = 10,
    ECHILD = 11,
    ECONNABORTED = 12,
    ECONNREFUSED = 13,
    ECONNRESET = 14,
    EDEADLK = 15,
    EDESTADDRREQ = 16,
    EDOM = 17,
    EDQUOT = 18,
    EEXIST = 19,
    EFAULT = 20,
    EFBIG = 21,
    EHOSTUNREACH = 22,
    EIDRM = 23,
    EILSEQ = 24,
    EINPROGRESS = 25,
    EINTR = 26,
    EINVAL = 27,
    EIO = 28,
    EISCONN = 29,
    EISDIR = 30,
    ELOOP = 31,
    EMFILE = 32,
    EMLINK = 33,
    EMSGSIZE = 34,
    EMULTIHOP = 35,
    ENAMETOOLONG = 36,
    ENETDOWN = 37,
    ENETRESET = 38,
    ENETUNREACH = 39,
    ENFILE = 40,
    ENOBUFS = 41,
    ENODATA = 42,
    ENODEV = 43,
    ENOENT = 44,
    ENOEXEC = 45,
    ENOLCK = 46,
    ENOLINK = 47,
    ENOMEM = 48,
    ENOMSG = 49,
    ENOPROTOOPT = 50,
    ENOSPC = 51,
    ENOSR = 52,
    ENOSTR = 53,
    ENOSYS = 54,
    ENOTCONN = 55,
    ENOTDIR = 56,
    ENOTEMPTY = 57,
    ENOTSOCK = 58,
    ENOTSUP = 59,
    ENOTTY = 60,
    ENXIO = 61,
    EOPNOTSUPP = 62,
    EOVERFLOW = 63,
    EPERM = 64,
    EPIPE = 65,
    EPROTO = 66,
    EPROTONOSUPPORT = 67,
    EPROTOTYPE = 68,
    ERANGE = 69,
    EROFS = 70,
    ESPIPE = 71,
    ESRCH = 72,
    ESTALE = 73,
    ETIME = 74,
    ETIMEDOUT = 75,
    ETXTBSY = 76,
    EWOULDBLOCK = 77,
    EXDEV = 78
}
export declare const posix: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
    13: string;
    14: string;
    15: string;
    16: string;
    17: string;
    18: string;
    19: string;
    20: string;
    21: string;
    22: string;
    23: string;
    24: string;
    25: string;
    26: string;
    27: string;
    28: string;
    29: string;
    30: string;
    31: string;
    32: string;
    33: string;
    34: string;
    35: string;
    36: string;
    37: string;
    38: string;
    39: string;
    40: string;
    41: string;
    42: string;
    43: string;
    44: string;
    45: string;
    46: string;
    47: string;
    48: string;
    49: string;
    50: string;
    51: string;
    52: string;
    53: string;
    54: string;
    55: string;
    56: string;
    57: string;
    58: string;
    59: string;
    60: string;
    61: string;
    62: string;
    63: string;
    64: string;
    65: string;
    66: string;
    67: string;
    68: string;
    69: string;
    70: string;
    71: string;
    72: string;
    73: string;
    74: string;
    75: string;
    76: string;
    77: string;
    78: string;
};
