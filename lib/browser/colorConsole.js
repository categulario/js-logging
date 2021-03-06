'use strict';

import { Logging } from './logging.browser.js';
import { unionOptions } from '../utils.js';

export function logToColorConsole(options) {
    let opt = {
        filters: {
            debug: 'Gray',
            info: 'Black',
            notice: 'Green',
            warning: 'Blue',
            error: 'Red',
            critical: 'Orange',
            alert: 'Cyan',
            emergency: 'Magenta'
        }
    };
    options = unionOptions(opt, options)

    return new Logging(options);
}