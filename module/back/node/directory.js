/**
 * https://nodejs.org/api/modules.html#modules_require_main
 */
export function get_root_path() {
    return ((require.main.path || module.path || process.mainModule.filename) + "/");
}
//# sourceMappingURL=directory.js.map