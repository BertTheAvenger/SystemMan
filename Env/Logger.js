const winston = require("winston");

const loggerLevels = {
    fatal: 0,
    alert: 1,
    error: 2,
    warn: 3,
    info: 4,
    debug: 5,
    silly: 6,
};

const loggerColors = {
    fatal: "bold black redBG",
    alert: "bold red",
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "yellow",
    silly: "magenta",
};

winston.addColors(loggerColors);

const myFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] - ${level}: ${message}`;
});

const testFormat = winston.format.combine(
    winston.format(info => {info.level = info.level.toUpperCase(); return info;})(),
    winston.format.colorize(),
    winston.format.timestamp(),
    myFormat
);

const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    format: testFormat,
    levels: loggerLevels,
});


module.exports = (moduleName) => function(logMsg, logLevel = "info"){
    logger.log({
        level: logLevel,
        message: logMsg,
        label: moduleName
    });
};