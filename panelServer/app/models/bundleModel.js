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
const logger = require('../modules/logger')('Bundle Model');

var db = require('../db/db_bridge');
const config = require('../config');
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
                                    bundle_name VARCHAR(255) NULL,
                                    bundle_price INT(11) NULL,
                                    bundle_currency VARCHAR(45) NULL,
                                    bundle_desc VARCHAR(255) NULL,
                                    bundle_sub_days INT(11) NULL,
                                    bundle_flags VARCHAR(50) NULL,
                                    created_at datetime DEFAULT NULL,
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
        logger.error("error in createTheTableIfNotExists->", error);
        reject(error)
      }
    });
  },

  /**
 * Insert a new bundle
 */
  insertNewPanelBundle: function (dataObj) {
    return new Promise(async (resolve, reject) => {
      try {

        // validation
        if (dataObj.bundleserverarray < 2) return reject("Operation Fail!, Select atleast two servers to create a bundle");
        if (!dataObj.bundlename) return reject("Operation Fail!, Bundle name is Missing");
        if (!dataObj.bundleprice) return reject("Operation Fail!, Bundle Price is Missing");
        if (!dataObj.bundlecurrency) return reject("Operation Fail!, Bundle Currency is Missing");
        if (!dataObj.bundlesubdays) return reject("Operation Fail!, Bundle Subscription days are Missing");
        if (!dataObj.bundlevipflag) return reject("Operation Fail!, Bundle VIP Flag is Missing");

        let query = db.queryFormat(`INSERT INTO ${table} 
                                    (bundle_name, 
                                    bundle_price,
                                    bundle_currency,
                                    bundle_desc,
                                    bundle_sub_days,
                                    bundle_flags,
                                    created_at) VALUES (?, ?, ?, ?, ? ,?,?)`,
          [dataObj.bundlename, dataObj.bundleprice, dataObj.bundlecurrency, dataObj.bundlename, dataObj.bundlesubdays, ('"' + dataObj.bundlevipflag + '"'), new Date()]);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in insertion bundle");
        }


        let bundleInsertId = queryRes.insertId
        let insertArray = []
        let serverArray = dataObj.bundleserverarray

        for (let i = 0; i < serverArray.length; i++) {
          insertArray.push([bundleInsertId, serverArray[i].split(':')[1]])
        }

        if (insertArray.length) {
          query = db.queryFormat(`INSERT INTO ${reltable}
                                      (bundle_id,server_id)
                                      VALUES ?`, [insertArray]);
          queryRes = await db.query(query, true);

          if (!queryRes) {
            return reject("Error in insertion bundle relation");
          }
        }

        return resolve(true);

      } catch (error) {
        logger.error("error in insertNewPanelServer->", error);
        reject(error)
      }
    });
  },

  /**
 * get all bundles list
 */
  getAllBundles: function () {
    return new Promise(async (resolve, reject) => {
      try {

        let query = db.queryFormat(`SELECT * FROM ${table}`);
        let queryRes = await db.query(query);

        if (!queryRes) {
          return reject("No Data Found");
        }

        let bundleData = queryRes

        for (let i = 0; i < bundleData.length; i++) {
          query = db.queryFormat(`SELECT tbl_servers.server_name,
                                  tbl_servers.server_ip,
                                  tbl_servers.server_port,
                                  tbl_servers.tbl_name
                                  FROM ${reltable}
                                  left join tbl_servers on tbl_servers.id = server_id 
                                  where bundle_id = ?`, [bundleData[i].id]);

          queryRes = await db.query(query);

          if (!queryRes) {
            return reject("Error in insertion bundle relation");
          }
          bundleData[i]["bundleServersData"] = queryRes
        }

        return resolve(bundleData);
      } catch (error) {
        logger.error("error in getAllSettings->", error);
        reject(error)
      }
    });
  },

  /**
* Delete a Bundle
*/
  deletePanelBundle: function (dataObj) {
    return new Promise(async (resolve, reject) => {
      try {

        // validation
        if (!dataObj.id) return reject("id is not provided");
        if (!dataObj.bundlename) return reject("Table Name is not provided");

        let query = db.queryFormat(`DELETE FROM ${table} WHERE id = ? AND bundle_name = ?`, [dataObj.id, dataObj.bundlename]);
        let queryRes = await db.query(query, true);

        if (!queryRes) {
          return reject("Error in delete");
        }

        query = db.queryFormat(`DELETE FROM ${reltable} WHERE bundle_id = ?`, [dataObj.id]);
        queryRes = await db.query(query, true);

        if (!queryRes) {
          return reject("Error in delete");
        }

        return resolve(queryRes);
      } catch (error) {
        logger.error("error in deletePanelServer->", error);
        reject(error)
      }
    });
  },

}

module.exports = bundleModel;