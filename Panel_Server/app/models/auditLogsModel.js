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
const logger = require('../modules/logger')('Audit Logs Model');

var db = require('../db/db_bridge');
const config = require('../config');
const table = config.audittable

/**
 *   sales Model
 */
var salesModel = {

  /**
 * create table if not exists
 */
  createTheTableIfNotExists: function () {
    return new Promise(async (resolve, reject) => {
      try {

        let query = db.queryFormat(`CREATE TABLE IF NOT EXISTS ${table} (
                                    id int(10) unsigned NOT NULL AUTO_INCREMENT,
                                    activity varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                    additional_info varchar(255) COLLATE utf8mb4_unicode_ci NULL,
                                    created_by varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
                                    created_at datetime NOT NULL,
                                    PRIMARY KEY (id)
                                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in creating user table");
        }
        return resolve(true);
      } catch (error) {
        logger.error("error in createTheTableIfNotExists->", error);
        reject(error)
      }
    });
  },

  /**
   * get all the servers
   */
  insertNewAuditRecord: function (dataObj) {
    return new Promise(async (resolve, reject) => {
      try {

        // validation
        if (!dataObj.activity) return reject("Activity can't be null");
        if (!dataObj.created_by) return reject("Created by can't be null");


        let currentDateTime = new Date()

        const query = db.queryFormat(`INSERT INTO ${table} 
                                        (activity,
                                        additional_info,
                                        created_by,
                                        created_at) VALUES (?, ?, ?, ?)`, [dataObj.activity, dataObj.additional_info, dataObj.created_by, currentDateTime]);

        const queryRes = await db.query(query);
        if (!queryRes) {
          return reject("error in insertion");
        }
        return resolve(true);
      } catch (error) {
        logger.error("error in insertNewAuditRecord->", error);
        reject(error)
      }
    });
  },

  /**
   * get all the sale data form the table
   */
  getAllAuditRecords: function (dataObj) {
    return new Promise(async (resolve, reject) => {
      try {

        let query = db.queryFormat(`SELECT * FROM ${table} 
                                    WHERE created_at >= ( Curdate() - INTERVAL 30 day ) 
                                    order by created_at DESC 
                                    LIMIT ${dataObj.recordPerPage} OFFSET ${(dataObj.currentPage - 1) * dataObj.recordPerPage}`);

        let queryRes = await db.query(query);
        if (!queryRes) {
          return reject("No Data Found");
        }
        let queryData = queryRes

        query = db.queryFormat(`SELECT COUNT(id) as count FROM ${table}`);
        queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("No Data Found");
        }
        let totalRecords = queryRes.count
        return resolve({
          auditRecords: queryData,
          totalRecords: totalRecords
        });
      } catch (error) {
        logger.error("error in getAllAuditRecords->", error);
        reject(error)
      }
    });
  },

}

module.exports = salesModel;