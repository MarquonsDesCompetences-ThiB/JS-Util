/**
 * From https://nodejs.org/api/os.html#os_error_constants
 */

/**
 * Returns the meaning of the specified error code as a string
 *
 * @param code Either the enum code or its string form
 */
export function get_str(code: eWindows | keyof typeof eWindows): string {
  if (code as eWindows) {
    return windows[code];
  }
  return windows[eWindows[code]];
}

export enum eWindows {
  WSAEINTR,
  WSAEBADF,
  WSAEACCES,
  WSAEFAULT,
  WSAEINVAL,
  WSAEMFILE,
  WSAEWOULDBLOCK,
  WSAEINPROGRESS,
  WSAEALREADY,
  WSAENOTSOCK,
  WSAEDESTADDRREQ,
  WSAEMSGSIZE,
  WSAEPROTOTYPE,
  WSAENOPROTOOPT,
  WSAEPROTONOSUPPORT,
  WSAESOCKTNOSUPPORT,
  WSAEOPNOTSUPP,
  WSAEPFNOSUPPORT,
  WSAEAFNOSUPPORT,
  WSAEADDRINUSE,
  WSAEADDRNOTAVAIL,
  WSAENETDOWN,
  WSAENETUNREACH,
  WSAENETRESET,
  WSAECONNABORTED,
  WSAECONNRESET,
  WSAENOBUFS,
  WSAEISCONN,
  WSAENOTCONN,
  WSAESHUTDOWN,
  WSAETOOMANYREFS,
  WSAETIMEDOUT,
  WSAECONNREFUSED,
  WSAELOOP,
  WSAENAMETOOLONG,
  WSAEHOSTDOWN,
  WSAEHOSTUNREACH,
  WSAENOTEMPTY,
  WSAEPROCLIM,
  WSAEUSERS,
  WSAEDQUOT,
  WSAESTALE,
  WSAEREMOTE,
  WSASYSNOTREADY,
  WSAVERNOTSUPPORTED,
  WSANOTINITIALISED,
  WSAEDISCON,
  WSAENOMORE,
  WSAECANCELLED,
  WSAEINVALIDPROCTABLE,
  WSAEINVALIDPROVIDER,
  WSAEPROVIDERFAILEDINIT,
  WSASYSCALLFAILURE,
  WSASERVICE_NOT_FOUND,
  WSATYPE_NOT_FOUND,
  WSA_E_NO_MORE,
  WSA_E_CANCELLED,
  WSAEREFUSED,
}

export const windows = {
  [eWindows.WSAEINTR]: "Indicates an interrupted function call.",
  [eWindows.WSAEBADF]: "Indicates an invalid file handle.",
  [eWindows.WSAEACCES]:
    "Indicates insufficient permissions to complete the operation.",
  [eWindows.WSAEFAULT]: "Indicates an invalid pointer address.",
  [eWindows.WSAEINVAL]: "Indicates that an invalid argument was passed.",
  [eWindows.WSAEMFILE]: "Indicates that there are too many open files.",
  [eWindows.WSAEWOULDBLOCK]:
    "Indicates that a resource is temporarily unavailable.",
  [eWindows.WSAEINPROGRESS]:
    "Indicates that an operation is currently in progress.",
  [eWindows.WSAEALREADY]: "Indicates that an operation is already in progress.",
  [eWindows.WSAENOTSOCK]: "Indicates that the resource is not a socket.",
  [eWindows.WSAEDESTADDRREQ]:
    "Indicates that a destination address is required.",
  [eWindows.WSAEMSGSIZE]: "Indicates that the message size is too long.",
  [eWindows.WSAEPROTOTYPE]: "Indicates the wrong protocol type for the socket.",
  [eWindows.WSAENOPROTOOPT]: "Indicates a bad protocol option.",
  [eWindows.WSAEPROTONOSUPPORT]:
    "Indicates that the protocol is not supported.",
  [eWindows.WSAESOCKTNOSUPPORT]:
    "Indicates that the socket type is not supported.",
  [eWindows.WSAEOPNOTSUPP]: "Indicates that the operation is not supported.",
  [eWindows.WSAEPFNOSUPPORT]:
    "Indicates that the protocol family is not supported.",
  [eWindows.WSAEAFNOSUPPORT]:
    "Indicates that the address family is not supported.",
  [eWindows.WSAEADDRINUSE]:
    "Indicates that the network address is already in use.",
  [eWindows.WSAEADDRNOTAVAIL]:
    "Indicates that the network address is not available.",
  [eWindows.WSAENETDOWN]: "Indicates that the network is down.",
  [eWindows.WSAENETUNREACH]: "Indicates that the network is unreachable.",
  [eWindows.WSAENETRESET]:
    "Indicates that the network connection has been reset.",
  [eWindows.WSAECONNABORTED]: "Indicates that the connection has been aborted.",
  [eWindows.WSAECONNRESET]:
    "Indicates that the connection has been reset by the peer.",
  [eWindows.WSAENOBUFS]: "Indicates that there is no buffer space available.",
  [eWindows.WSAEISCONN]: "Indicates that the socket is already connected.",
  [eWindows.WSAENOTCONN]: "Indicates that the socket is not connected.",
  [eWindows.WSAESHUTDOWN]:
    "Indicates that data cannot be sent after the socket has been shutdown.",
  [eWindows.WSAETOOMANYREFS]: "Indicates that there are too many references.",
  [eWindows.WSAETIMEDOUT]: "Indicates that the connection has timed out.",
  [eWindows.WSAECONNREFUSED]: "Indicates that the connection has been refused.",
  [eWindows.WSAELOOP]: "Indicates that a name cannot be translated.",
  [eWindows.WSAENAMETOOLONG]: "Indicates that a name was too long.",
  [eWindows.WSAEHOSTDOWN]: "Indicates that a network host is down.",
  [eWindows.WSAEHOSTUNREACH]:
    "Indicates that there is no route to a network host.",
  [eWindows.WSAENOTEMPTY]: "Indicates that the directory is not empty.",
  [eWindows.WSAEPROCLIM]: "Indicates that there are too many processes.",
  [eWindows.WSAEUSERS]: "Indicates that the user quota has been exceeded.",
  [eWindows.WSAEDQUOT]: "Indicates that the disk quota has been exceeded.",
  [eWindows.WSAESTALE]: "Indicates a stale file handle reference.",
  [eWindows.WSAEREMOTE]: "Indicates that the item is remote.",
  [eWindows.WSASYSNOTREADY]:
    "Indicates that the network subsystem is not ready.",
  [eWindows.WSAVERNOTSUPPORTED]:
    "Indicates that the winsock.dll version is out of range.",
  [eWindows.WSANOTINITIALISED]:
    "Indicates that successful WSAStartup has not yet been performed.",
  [eWindows.WSAEDISCON]: "Indicates that a graceful shutdown is in progress.",
  [eWindows.WSAENOMORE]: "Indicates that there are no more results.",
  [eWindows.WSAECANCELLED]: "Indicates that an operation has been canceled.",
  [eWindows.WSAEINVALIDPROCTABLE]:
    "Indicates that the procedure call table is invalid.",
  [eWindows.WSAEINVALIDPROVIDER]: "Indicates an invalid service provider.",
  [eWindows.WSAEPROVIDERFAILEDINIT]:
    "Indicates that the service provider failed to initialized.",
  [eWindows.WSASYSCALLFAILURE]: "Indicates a system call failure.",
  [eWindows.WSASERVICE_NOT_FOUND]: "Indicates that a service was not found.",
  [eWindows.WSATYPE_NOT_FOUND]: "Indicates that a class type was not found.",
  [eWindows.WSA_E_NO_MORE]: "Indicates that there are no more results.",
  [eWindows.WSA_E_CANCELLED]: "Indicates that the call was canceled.",
  [eWindows.WSAEREFUSED]: "Indicates that a database query was refused.",
};
