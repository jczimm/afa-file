var _ = {},
    lodashModuleNames = ["padLeft", "uniq", "includes", "defaults"];
    
lodashModuleNames.forEach(function loadLodashModule(moduleName) {
    _[moduleName] = require("lodash." + moduleName);
});

module.exports = _;