'use strict';

export function unionOptions(defaultOptions, options) {
    for (let prop in options) {
        defaultOptions[prop] = options[prop];
    }
    return defaultOptions;
}

export function assembleOutput(format) {
    return new Function('timestamp', 'title', 'level', 'message', 'file', 'line', 'pos', 'path', 'method', 'stack', 'return `' + format + '`;');
}

export function assembleFilePath(format) {
    return new Function('path', 'filename', 'filenameDateFormat', 'return `' + format + '`;');
}