const path = require("path");
const fs = require("fs");
const { constants } = require('../config');

const loadRoutesAndMiddleware = async function (app) {
    try {
        const modulesPath = path.join(__dirname, "../src");
        const modules = fs.readdirSync(path.join(__dirname, "../src"));
        for (let i = 0, { length } = modules; i < length; i++) {
            const moduleFiles = modules[i];
            const routePath = path.join(modulesPath, moduleFiles);
            const routes = fs.readdirSync(routePath);
            routes.forEach(function (file) {
                const fileName = file.split(".");
                const modelData = fileName[0];
                if (modelData && (modelData.toLowerCase() === "route" || modelData.toLowerCase() === "utill")) {
                    return (require(path.join(routePath, file)))(app);
                }
            });
        }
    } catch (error) {
        const loggerObject = {
            fileName: "server-utils.js",
            methodName: "loadRoutesAndMiddleware",
            type: constants.LOGGER_LEVELS.ERROR,
            error,
        };
        global.logger(loggerObject);
        throw new Error(`Error while loading all routes and utils file: ${error}`);
    }
};

module.exports = {
    appUtility: {
        loadRoutesAndMiddleware,
    },
};