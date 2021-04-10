/// <reference types="node" />
import { Dirent } from "fs";
export interface iDirent {
    isFile: () => boolean;
    isDirectory: () => boolean;
    isBlockDevice: () => boolean;
    isCharacterDevice: () => boolean;
    isSymbolicLink: () => boolean;
    isFIFO: () => boolean;
    isSocket: () => boolean;
    name: string;
}
export interface iDirent_json {
    isFile: boolean;
    isDirectory: boolean;
    isBlockDevice: boolean;
    isCharacterDevice: boolean;
    isSymbolicLink: boolean;
    isFIFO: boolean;
    isSocket: boolean;
    name: string;
    ext?: string;
}
export declare function from_Dirent(dirent: Dirent): iDirent_json;
export declare function to_Dirent(iDir: iDirent_json): Dirent;
