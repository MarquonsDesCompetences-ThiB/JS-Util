import { Stats } from "fs";
export function equal(stats1: Stats, stats2: Stats): boolean {
  return equal_metas(stats1, stats2) && equal_type(stats1, stats2);
}

export function equal_metas(stats1: Stats, stats2: Stats): boolean {
  if (!stats1 || !stats2) {
    return false;
  }

  return (
    stats1.dev === stats2.dev &&
    stats1.ino === stats2.ino &&
    stats1.mode === stats2.mode &&
    stats1.nlink === stats2.nlink &&
    stats1.uid === stats2.uid &&
    stats1.gid === stats2.gid &&
    stats1.rdev === stats2.rdev &&
    stats1.size === stats2.size &&
    stats1.blksize === stats2.blksize &&
    stats1.blocks === stats2.blocks &&
    stats1.atimeMs === stats2.atimeMs &&
    stats1.mtimeMs === stats2.mtimeMs &&
    stats1.ctimeMs === stats2.ctimeMs &&
    stats1.birthtimeMs === stats2.birthtimeMs &&
    stats1.atime === stats2.atime &&
    stats1.mtime === stats2.mtime &&
    stats1.ctime === stats2.ctime &&
    stats1.birthtime === stats2.birthtime
  );
}

export function equal_type(stats1: Stats, stats2: Stats): boolean {
  if (!stats1 || !stats2) {
    return false;
  }

  return (
    stats1.isFile() === stats2.isFile() &&
    stats1.isDirectory() === stats2.isDirectory() &&
    stats1.isBlockDevice() === stats2.isBlockDevice() &&
    stats1.isCharacterDevice() === stats2.isCharacterDevice() &&
    stats1.isSymbolicLink() === stats2.isSymbolicLink() &&
    stats1.isFIFO() === stats2.isFIFO() &&
    stats1.isSocket() === stats2.isSocket()
  );
}
