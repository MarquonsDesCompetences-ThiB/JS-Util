"use strict";
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

export async function import_file_async(file_path) {
  let module;

  await import(pathToFileURL(file_path).toString()).then((imported) => {
    module = imported;
  });

  return module;
}

export async function import_files_async(...file_path) {
  let modules;
  const promises = [];
  file_path.forEach((path) => {
    promises.push(import(pathToFileURL(path).toString()));
  });

  await Promise.all(promises).then((importeds) => {
    modules = importeds;
  });

  return modules;
}
