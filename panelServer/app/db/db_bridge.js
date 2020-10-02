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

const pool = require('./connection');
const mysql = require('mysql2');

/**
 * Executes SQL query and returns data.
 * @constructor
 * @param {string} queryText - SQL query string
 * @param {boolean} singleRecord - single record
 */
const query = async function (queryText, singleRecord) {
    const [results] = await pool.query(queryText);
    if (Array.isArray(results)) {
        const finalResults = [];
        const resultsLength = results.length;
        for (let index = 0; index < resultsLength; index++) {
            finalResults.push({ ...results[index] });
        }
        // For single record
        if (typeof (singleRecord) == "boolean" && singleRecord) return finalResults[0];
        // For multiple records
        return finalResults;
    }
    return results;
};

/**
 * shim for formatting the query
 */
var queryFormat = mysql.format;

/**
 * escaping the data
 */
var dataEscape = mysql.escape;

module.exports = {
    dbPool: pool,
    query,
    queryFormat,
    dataEscape
};