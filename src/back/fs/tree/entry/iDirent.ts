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

  //
  // To be used when name is an accessor
  //_name: string;
  name: string; // | (() => string) | ((name: string) => void);

  //
  // To be used when ext is an accessor
  //_ext?: string;
  ext?: string; // | (() => string) | ((name: string) => void);
}

export function from_Dirent(dirent: Dirent): iDirent_json {
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

export function to_Dirent(iDir: iDirent_json): Dirent {
  const dirent = new Dirent();
  dirent.name = <string>iDir.name;

  if (iDir.ext) {
    dirent.name += "." + iDir.ext;
  }

  return dirent;
}
