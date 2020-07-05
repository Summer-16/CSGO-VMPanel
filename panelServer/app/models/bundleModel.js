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

"use strict";

var db = require('../db/db_bridge');
const config = require('../config/config.json')
const table = config.bundletable
const reltable = config.bundleRELtable

/**
 *   bundle Model
 */
var bundleModel = {

  /**
 * create table if not exists
 */
  createTheTableIfNotExists: function () {
    return new Promise(async (resolve, reject) => {
      try {

        let query = db.queryFormat(`CREATE TABLE IF NOT EXISTS ${table} (
                                    id INT NOT NULL AUTO_INCREMENT,
                                    name VARCHAR(255) NULL,
                                    bundle_price INT(11) NULL,
                                    bundle_currency VARCHAR(45) NULL,
                                    bundle_desc VARCHAR(255) NULL,
                                    PRIMARY KEY (id)
                                  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in creating bundle table");
        }

        query = db.queryFormat(`CREATE TABLE IF NOT EXISTS ${reltable} (
                                id INT NOT NULL AUTO_INCREMENT,
                                bundle_id INT(11) NULL,
                                server_id INT(11) NULL,
                                PRIMARY KEY (id)
                              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in creating bundle relation table");
        }

        return resolve(true);
      } catch (error) {
        console.log("error in createTheTableIfNotExists->", error)
        reject(error)
      }
    });
  },

}

module.exports = bundleModel;