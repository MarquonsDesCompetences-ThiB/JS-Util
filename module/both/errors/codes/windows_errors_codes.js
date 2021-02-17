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
        return windows[code];
    }
    return windows[eWindows[code]];
}
export var eWindows;
(function (eWindows) {
    eWindows[eWindows["WSAEINTR"] = 0] = "WSAEINTR";
    eWindows[eWindows["WSAEBADF"] = 1] = "WSAEBADF";
    eWindows[eWindows["WSAEACCES"] = 2] = "WSAEACCES";
    eWindows[eWindows["WSAEFAULT"] = 3] = "WSAEFAULT";
    eWindows[eWindows["WSAEINVAL"] = 4] = "WSAEINVAL";
    eWindows[eWindows["WSAEMFILE"] = 5] = "WSAEMFILE";
    eWindows[eWindows["WSAEWOULDBLOCK"] = 6] = "WSAEWOULDBLOCK";
    eWindows[eWindows["WSAEINPROGRESS"] = 7] = "WSAEINPROGRESS";
    eWindows[eWindows["WSAEALREADY"] = 8] = "WSAEALREADY";
    eWindows[eWindows["WSAENOTSOCK"] = 9] = "WSAENOTSOCK";
    eWindows[eWindows["WSAEDESTADDRREQ"] = 10] = "WSAEDESTADDRREQ";
    eWindows[eWindows["WSAEMSGSIZE"] = 11] = "WSAEMSGSIZE";
    eWindows[eWindows["WSAEPROTOTYPE"] = 12] = "WSAEPROTOTYPE";
    eWindows[eWindows["WSAENOPROTOOPT"] = 13] = "WSAENOPROTOOPT";
    eWindows[eWindows["WSAEPROTONOSUPPORT"] = 14] = "WSAEPROTONOSUPPORT";
    eWindows[eWindows["WSAESOCKTNOSUPPORT"] = 15] = "WSAESOCKTNOSUPPORT";
    eWindows[eWindows["WSAEOPNOTSUPP"] = 16] = "WSAEOPNOTSUPP";
    eWindows[eWindows["WSAEPFNOSUPPORT"] = 17] = "WSAEPFNOSUPPORT";
    eWindows[eWindows["WSAEAFNOSUPPORT"] = 18] = "WSAEAFNOSUPPORT";
    eWindows[eWindows["WSAEADDRINUSE"] = 19] = "WSAEADDRINUSE";
    eWindows[eWindows["WSAEADDRNOTAVAIL"] = 20] = "WSAEADDRNOTAVAIL";
    eWindows[eWindows["WSAENETDOWN"] = 21] = "WSAENETDOWN";
    eWindows[eWindows["WSAENETUNREACH"] = 22] = "WSAENETUNREACH";
    eWindows[eWindows["WSAENETRESET"] = 23] = "WSAENETRESET";
    eWindows[eWindows["WSAECONNABORTED"] = 24] = "WSAECONNABORTED";
    eWindows[eWindows["WSAECONNRESET"] = 25] = "WSAECONNRESET";
    eWindows[eWindows["WSAENOBUFS"] = 26] = "WSAENOBUFS";
    eWindows[eWindows["WSAEISCONN"] = 27] = "WSAEISCONN";
    eWindows[eWindows["WSAENOTCONN"] = 28] = "WSAENOTCONN";
    eWindows[eWindows["WSAESHUTDOWN"] = 29] = "WSAESHUTDOWN";
    eWindows[eWindows["WSAETOOMANYREFS"] = 30] = "WSAETOOMANYREFS";
    eWindows[eWindows["WSAETIMEDOUT"] = 31] = "WSAETIMEDOUT";
    eWindows[eWindows["WSAECONNREFUSED"] = 32] = "WSAECONNREFUSED";
    eWindows[eWindows["WSAELOOP"] = 33] = "WSAELOOP";
    eWindows[eWindows["WSAENAMETOOLONG"] = 34] = "WSAENAMETOOLONG";
    eWindows[eWindows["WSAEHOSTDOWN"] = 35] = "WSAEHOSTDOWN";
    eWindows[eWindows["WSAEHOSTUNREACH"] = 36] = "WSAEHOSTUNREACH";
    eWindows[eWindows["WSAENOTEMPTY"] = 37] = "WSAENOTEMPTY";
    eWindows[eWindows["WSAEPROCLIM"] = 38] = "WSAEPROCLIM";
    eWindows[eWindows["WSAEUSERS"] = 39] = "WSAEUSERS";
    eWindows[eWindows["WSAEDQUOT"] = 40] = "WSAEDQUOT";
    eWindows[eWindows["WSAESTALE"] = 41] = "WSAESTALE";
    eWindows[eWindows["WSAEREMOTE"] = 42] = "WSAEREMOTE";
    eWindows[eWindows["WSASYSNOTREADY"] = 43] = "WSASYSNOTREADY";
    eWindows[eWindows["WSAVERNOTSUPPORTED"] = 44] = "WSAVERNOTSUPPORTED";
    eWindows[eWindows["WSANOTINITIALISED"] = 45] = "WSANOTINITIALISED";
    eWindows[eWindows["WSAEDISCON"] = 46] = "WSAEDISCON";
    eWindows[eWindows["WSAENOMORE"] = 47] = "WSAENOMORE";
    eWindows[eWindows["WSAECANCELLED"] = 48] = "WSAECANCELLED";
    eWindows[eWindows["WSAEINVALIDPROCTABLE"] = 49] = "WSAEINVALIDPROCTABLE";
    eWindows[eWindows["WSAEINVALIDPROVIDER"] = 50] = "WSAEINVALIDPROVIDER";
    eWindows[eWindows["WSAEPROVIDERFAILEDINIT"] = 51] = "WSAEPROVIDERFAILEDINIT";
    eWindows[eWindows["WSASYSCALLFAILURE"] = 52] = "WSASYSCALLFAILURE";
    eWindows[eWindows["WSASERVICE_NOT_FOUND"] = 53] = "WSASERVICE_NOT_FOUND";
    eWindows[eWindows["WSATYPE_NOT_FOUND"] = 54] = "WSATYPE_NOT_FOUND";
    eWindows[eWindows["WSA_E_NO_MORE"] = 55] = "WSA_E_NO_MORE";
    eWindows[eWindows["WSA_E_CANCELLED"] = 56] = "WSA_E_CANCELLED";
    eWindows[eWindows["WSAEREFUSED"] = 57] = "WSAEREFUSED";
})(eWindows || (eWindows = {}));
export const windows = {
    [eWindows.WSAEINTR]: "Indicates an interrupted function call.",
    [eWindows.WSAEBADF]: "Indicates an invalid file handle.",
    [eWindows.WSAEACCES]: "Indicates insufficient permissions to complete the operation.",
    [eWindows.WSAEFAULT]: "Indicates an invalid pointer address.",
    [eWindows.WSAEINVAL]: "Indicates that an invalid argument was passed.",
    [eWindows.WSAEMFILE]: "Indicates that there are too many open files.",
    [eWindows.WSAEWOULDBLOCK]: "Indicates that a resource is temporarily unavailable.",
    [eWindows.WSAEINPROGRESS]: "Indicates that an operation is currently in progress.",
    [eWindows.WSAEALREADY]: "Indicates that an operation is already in progress.",
    [eWindows.WSAENOTSOCK]: "Indicates that the resource is not a socket.",
    [eWindows.WSAEDESTADDRREQ]: "Indicates that a destination address is required.",
    [eWindows.WSAEMSGSIZE]: "Indicates that the message size is too long.",
    [eWindows.WSAEPROTOTYPE]: "Indicates the wrong protocol type for the socket.",
    [eWindows.WSAENOPROTOOPT]: "Indicates a bad protocol option.",
    [eWindows.WSAEPROTONOSUPPORT]: "Indicates that the protocol is not supported.",
    [eWindows.WSAESOCKTNOSUPPORT]: "Indicates that the socket type is not supported.",
    [eWindows.WSAEOPNOTSUPP]: "Indicates that the operation is not supported.",
    [eWindows.WSAEPFNOSUPPORT]: "Indicates that the protocol family is not supported.",
    [eWindows.WSAEAFNOSUPPORT]: "Indicates that the address family is not supported.",
    [eWindows.WSAEADDRINUSE]: "Indicates that the network address is already in use.",
    [eWindows.WSAEADDRNOTAVAIL]: "Indicates that the network address is not available.",
    [eWindows.WSAENETDOWN]: "Indicates that the network is down.",
    [eWindows.WSAENETUNREACH]: "Indicates that the network is unreachable.",
    [eWindows.WSAENETRESET]: "Indicates that the network connection has been reset.",
    [eWindows.WSAECONNABORTED]: "Indicates that the connection has been aborted.",
    [eWindows.WSAECONNRESET]: "Indicates that the connection has been reset by the peer.",
    [eWindows.WSAENOBUFS]: "Indicates that there is no buffer space available.",
    [eWindows.WSAEISCONN]: "Indicates that the socket is already connected.",
    [eWindows.WSAENOTCONN]: "Indicates that the socket is not connected.",
    [eWindows.WSAESHUTDOWN]: "Indicates that data cannot be sent after the socket has been shutdown.",
    [eWindows.WSAETOOMANYREFS]: "Indicates that there are too many references.",
    [eWindows.WSAETIMEDOUT]: "Indicates that the connection has timed out.",
    [eWindows.WSAECONNREFUSED]: "Indicates that the connection has been refused.",
    [eWindows.WSAELOOP]: "Indicates that a name cannot be translated.",
    [eWindows.WSAENAMETOOLONG]: "Indicates that a name was too long.",
    [eWindows.WSAEHOSTDOWN]: "Indicates that a network host is down.",
    [eWindows.WSAEHOSTUNREACH]: "Indicates that there is no route to a network host.",
    [eWindows.WSAENOTEMPTY]: "Indicates that the directory is not empty.",
    [eWindows.WSAEPROCLIM]: "Indicates that there are too many processes.",
    [eWindows.WSAEUSERS]: "Indicates that the user quota has been exceeded.",
    [eWindows.WSAEDQUOT]: "Indicates that the disk quota has been exceeded.",
    [eWindows.WSAESTALE]: "Indicates a stale file handle reference.",
    [eWindows.WSAEREMOTE]: "Indicates that the item is remote.",
    [eWindows.WSASYSNOTREADY]: "Indicates that the network subsystem is not ready.",
    [eWindows.WSAVERNOTSUPPORTED]: "Indicates that the winsock.dll version is out of range.",
    [eWindows.WSANOTINITIALISED]: "Indicates that successful WSAStartup has not yet been performed.",
    [eWindows.WSAEDISCON]: "Indicates that a graceful shutdown is in progress.",
    [eWindows.WSAENOMORE]: "Indicates that there are no more results.",
    [eWindows.WSAECANCELLED]: "Indicates that an operation has been canceled.",
    [eWindows.WSAEINVALIDPROCTABLE]: "Indicates that the procedure call table is invalid.",
    [eWindows.WSAEINVALIDPROVIDER]: "Indicates an invalid service provider.",
    [eWindows.WSAEPROVIDERFAILEDINIT]: "Indicates that the service provider failed to initialized.",
    [eWindows.WSASYSCALLFAILURE]: "Indicates a system call failure.",
    [eWindows.WSASERVICE_NOT_FOUND]: "Indicates that a service was not found.",
    [eWindows.WSATYPE_NOT_FOUND]: "Indicates that a class type was not found.",
    [eWindows.WSA_E_NO_MORE]: "Indicates that there are no more results.",
    [eWindows.WSA_E_CANCELLED]: "Indicates that the call was canceled.",
    [eWindows.WSAEREFUSED]: "Indicates that a database query was refused.",
};
//# sourceMappingURL=windows_errors_codes.js.map