'use strict';

import { Logging } from './logging.browser.js';

export function logToConsole(options) {
    return new Logging(options);
}