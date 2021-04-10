import { Dirent } from "fs";
export function from_Dirent(dirent) {
    return {
        isFile: dirent.isFile(),
        isDirectory: dirent.isDirectory(),
        isBlockDevice: dirent.isBlockDevice(),
        isCharacterDevice: dirent.isCharacterDevice(),
        isSymbolicLink: dirent.isSymbolicLink(),
        isFIFO: dirent.isFIFO(),
        isSocket: dirent.isSocket(),
        name: dirent.name,
    };
}
export function to_Dirent(iDir) {
    const dirent = new Dirent();
    dirent.name = iDir.name;
    if (iDir.ext) {
        dirent.name += "." + iDir.ext;
    }
    return dirent;
}
//# sourceMappingURL=iDirent.js.map