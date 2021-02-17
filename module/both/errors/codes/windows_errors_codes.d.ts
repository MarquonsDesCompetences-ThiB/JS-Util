/**
 * From https://nodejs.org/api/os.html#os_error_constants
 */
/**
 * Returns the meaning of the specified error code as a string
 *
 * @param code Either the enum code or its string form
 */
export declare function get_str(code: eWindows | keyof typeof eWindows): string;
export declare enum eWindows {
    WSAEINTR = 0,
    WSAEBADF = 1,
    WSAEACCES = 2,
    WSAEFAULT = 3,
    WSAEINVAL = 4,
    WSAEMFILE = 5,
    WSAEWOULDBLOCK = 6,
    WSAEINPROGRESS = 7,
    WSAEALREADY = 8,
    WSAENOTSOCK = 9,
    WSAEDESTADDRREQ = 10,
    WSAEMSGSIZE = 11,
    WSAEPROTOTYPE = 12,
    WSAENOPROTOOPT = 13,
    WSAEPROTONOSUPPORT = 14,
    WSAESOCKTNOSUPPORT = 15,
    WSAEOPNOTSUPP = 16,
    WSAEPFNOSUPPORT = 17,
    WSAEAFNOSUPPORT = 18,
    WSAEADDRINUSE = 19,
    WSAEADDRNOTAVAIL = 20,
    WSAENETDOWN = 21,
    WSAENETUNREACH = 22,
    WSAENETRESET = 23,
    WSAECONNABORTED = 24,
    WSAECONNRESET = 25,
    WSAENOBUFS = 26,
    WSAEISCONN = 27,
    WSAENOTCONN = 28,
    WSAESHUTDOWN = 29,
    WSAETOOMANYREFS = 30,
    WSAETIMEDOUT = 31,
    WSAECONNREFUSED = 32,
    WSAELOOP = 33,
    WSAENAMETOOLONG = 34,
    WSAEHOSTDOWN = 35,
    WSAEHOSTUNREACH = 36,
    WSAENOTEMPTY = 37,
    WSAEPROCLIM = 38,
    WSAEUSERS = 39,
    WSAEDQUOT = 40,
    WSAESTALE = 41,
    WSAEREMOTE = 42,
    WSASYSNOTREADY = 43,
    WSAVERNOTSUPPORTED = 44,
    WSANOTINITIALISED = 45,
    WSAEDISCON = 46,
    WSAENOMORE = 47,
    WSAECANCELLED = 48,
    WSAEINVALIDPROCTABLE = 49,
    WSAEINVALIDPROVIDER = 50,
    WSAEPROVIDERFAILEDINIT = 51,
    WSASYSCALLFAILURE = 52,
    WSASERVICE_NOT_FOUND = 53,
    WSATYPE_NOT_FOUND = 54,
    WSA_E_NO_MORE = 55,
    WSA_E_CANCELLED = 56,
    WSAEREFUSED = 57
}
export declare const windows: {
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
};
