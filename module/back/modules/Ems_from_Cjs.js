"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pathToFileURL } from "url";
export function import_file(file_path) {
    return import(pathToFileURL(file_path).toString());
}
export function import_files(...file_path) {
    const promises = [];
    file_path.forEach((path) => {
        promises.push(import(pathToFileURL(path).toString()));
    });
    return Promise.all(promises);
}
export function import_file_async(file_path) {
    return __awaiter(this, void 0, void 0, function* () {
        let module;
        yield import(pathToFileURL(file_path).toString()).then((imported) => {
            module = imported;
        });
        return module;
    });
}
export function import_files_async(...file_path) {
    return __awaiter(this, void 0, void 0, function* () {
        let modules;
        const promises = [];
        file_path.forEach((path) => {
            promises.push(import(pathToFileURL(path).toString()));
        });
        yield Promise.all(promises).then((importeds) => {
            modules = importeds;
        });
        return modules;
    });
}
export function get_root_dir_path() {
    //return dirname(fileURLToPath(import.meta.url));
    return process.env.INIT_CWD;
}
//# sourceMappingURL=Ems_from_Cjs.js.map