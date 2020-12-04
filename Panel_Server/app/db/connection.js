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
const logger = require('../modules/logger')('MySQL Connection');

const mysql = require('mysql2/promise');
const config = require('../config');
const dbConfig = config.db;

var pool;
const sqlOptions = {
    connectionLimit: 20, //important
    host: dbConfig.db_host,
    user: dbConfig.db_user,
    password: dbConfig.db_password,
    database: dbConfig.db_name,
    port: dbConfig.db_port,
    multipleStatements: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
    waitForConnections: true,
    // debug: true
}

try {
    pool = mysql.createPool(sqlOptions);
} catch (error) {
    logger.error("Connection Pool Error : ", error);
}

// pool.getConnection((err, connection) => {
//     if (err) {
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//             console.error('Database connection was closed.');
//         }
//         if (err.code === 'ER_CON_COUNT_ERROR') {
//             console.error('Database has too many connections.');
//         }
//         if (err.code === 'ECONNREFUSED') {
//             console.error('Database connection was refused.');
//         }
//     }

//     if (connection) {
//         logger.info("MYSQL connection established");
//         connection.release();
//     }

//     return;
// });

module.exports = pool;