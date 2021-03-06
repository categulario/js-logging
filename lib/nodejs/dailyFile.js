'use strict';
let fs = require('fs');
let path = require('path');

import { Logging } from './logging.js';
import { dateFormat } from '../dateformat.js';
import { unionOptions, assembleFilePath } from '../utils.js';

function createDirectory(dir) {
    if (fs.existsSync(dir)) return;
    createDirectory(path.dirname(dir));
    fs.mkdirSync(dir);
}

export function logToDailyFile (options) {
    const defaultFileOptions = {
        path: '.',
        filename: 'js-logging',
        filenameDateFormat: 'yyyymmdd',
        pathFormat: '${path}/${filename}${filenameDateFormat}.log',
        lineEnding: '\r\n'
    };
    
    options = unionOptions(defaultFileOptions, options);
    
    function LogFile(date) {
        let template = assembleFilePath(options.pathFormat);
        date = '.' + date;
        let path = template(options.path, options.filename, date);
        createDirectory(options.path);
        this.stream = fs.createWriteStream(path, { flags: 'a', defaultEncoding: 'utf8', fd: null, mode: 0o666, autoClose: true });
    }
    LogFile.prototype.write = function (str) {
        this.stream.write(str + options.lineEnding);
    };
    LogFile.prototype.destroy = function () {
        if (this.stream) {
            this.stream.end();
            this.stream = null;
        }
    };

    let logFile = null;

    function dailyFileTransport(data) {
        
        // check time
        let now = dateFormat(new Date(), options.filenameDateFormat);
        if (logFile && logFile.date != now) {
            logFile.destroy();
            logFile = null;
        }
        if (!logFile) {
            logFile = new LogFile(now);
        }
        logFile.write(data.output);
    }

    if (options.transport) {
        options.transport = Array.isArray(options.transport) ? options.transport : [options.transport];
        options.transport.push(dailyFileTransport)
    } else {
        options.transport = [dailyFileTransport];
    }
    
    return new Logging(options);
}

export function logToFile12(options) {
    let opt = {
        transport : function(data) {
            console.log(data.output);
            fs.appendFile('./file.log', data.output + '\n', (err) => {
                if (err) throw err;
            });
        }
    };
    options = unionOptions(opt, options);

    return new Logging(options);
}

