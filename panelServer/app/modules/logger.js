/* VMP-by-Summer-Soldier
*
* Copyright (C) 2020 SUMMER SOLDIER
*
* This file is part of VMP-by-Summer-Soldier
*
* VMP-by-Summer-Soldier is free software: you can redistribute it and/or modify it
* under the terms of the GNU General Public License as published by the Free
* Software Foundation, either version 3 of the License, or (at your option)
* any later version.
*
* VMP-by-Summer-Soldier is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License along with
* VMP-by-Summer-Soldier. If not, see http://www.gnu.org/licenses/.
*/

'use strict';

const log4js = require('log4js');
const config = require('../config');
const cryptoCustom = require('../utils/crypto');
const loggerConfig = config.logging ? config.logging : {};

// Fallback
if (!loggerConfig.logLevel) {
    loggerConfig.logLevel = "ERROR";
}
// https://log4js-node.github.io/log4js-node/layouts.html
log4js.configure({
    appenders: {
        stdout: {
            type: 'stdout',
            layout: {
                type: 'pattern',
                pattern: '%[[%x{uuid}] [%d] [%p] <%c> {%f{2}:%l}%] => %m',
                tokens: {
                    uuid: function (logEvent) {
                        return cryptoCustom.getUUID();
                    }
                }
            },
        }
    },
    categories: {
        default: {
            appenders: ['stdout'],
            level: loggerConfig.logLevel,
            enableCallStack: true
        }
    }
});

module.exports = (moduleName) => {
    const logger = log4js.getLogger(moduleName);
    return logger;
};