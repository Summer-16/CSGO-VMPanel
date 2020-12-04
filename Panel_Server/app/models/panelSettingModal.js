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
const logger = require('../modules/logger')('Panel Setting Model');

var db = require('../db/db_bridge');
const config = require('../config');
const table = config.settingTable
const valueArray = [["color_theme", "danger"],
["dash_vip_show", "1"],
["dash_admin_show", "1"],
["webhook_url", ""],
["community_name", "VMPanel"],
["normiadmin_settings", "1"],
["community_logo_url", ""],
["community_info", ""],
["community_website", ""],
["platform_currency", "USD"],
["hiddenadmin_login", "0"],
["salenotification_discord", "0"]]

/**
 *   setting Model
 */
var settingsModal = {

  /**
 * create table if not exists
 */
  createTheTableIfNotExists: function () {
    return new Promise(async (resolve, reject) => {
      try {

        let query = db.queryFormat(`CREATE TABLE IF NOT EXISTS ${table} (
                                    id int(11) NOT NULL AUTO_INCREMENT,
                                    setting_key varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
                                    setting_value varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                                    PRIMARY KEY(id)
                                  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci`);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in creating user table");
        }

        query = db.queryFormat(`SELECT * FROM ${table}`);
        queryRes = await db.query(query);
        if (!queryRes) {
          return reject("Error in querying settings, This can be ignored");
        }

        if (queryRes.length === 0) {
          query = db.queryFormat(`INSERT INTO ${table}
                                      (setting_key,setting_value)
                                      VALUES ?`, [valueArray]);
          queryRes = await db.query(query, true);
          if (!queryRes) {
            return reject("Error while filling entry in table");
          }
        }
        return resolve(true);
      } catch (error) {
        logger.error("error in createTheTableIfNotExists->", error);
        reject(error)
      }
    });
  },

  /**
   * get all the settings data form the table
   */
  getAllSettings: function () {
    return new Promise(async (resolve, reject) => {
      try {

        let query = db.queryFormat(`SELECT * FROM ${table}`);
        let queryRes = await db.query(query);
        if (!queryRes) {
          return reject("No Data Found");
        }
        let settingObj = {}
        for (let i = 0; i < queryRes.length; i++) {
          settingObj[queryRes[i].setting_key] = queryRes[i].setting_value
        }
        return resolve(settingObj);
      } catch (error) {
        logger.error("error in getAllSettings->", error);
        reject(error)
      }
    });
  },


  /**
 * Insert a new user
 */
  updatesetting: function (key, value) {
    return new Promise(async (resolve, reject) => {
      try {

        // validation
        if (!key) return reject("Key is not provided");
        //if (!value) return reject("Value is not provided");

        let query = db.queryFormat(`UPDATE ${table} SET setting_value = ? WHERE setting_key = ?`, [value, key]);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in Update");
        }
        return resolve(queryRes);
      } catch (error) {
        logger.error("error in update setting->", error);
        reject(error)
      }
    });
  },

  /**
* get all tables name
*/
  getAllTables: function () {
    return new Promise(async (resolve, reject) => {
      try {

        let query = db.queryFormat(`show tables`);
        let queryRes = await db.query(query);
        if (!queryRes) {
          return reject("Error in Update");
        }
        return resolve(queryRes);
      } catch (error) {
        logger.error("error in getAllTables->", error);
        reject(error)
      }
    });
  },

}

module.exports = settingsModal;