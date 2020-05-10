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
const table = config.usersTable

/**
 *   User Model
 */
var userDataModel = {

  /**
 * create table if not exists
 */
  createTheTableIfNotExists: function () {
    return new Promise(async (resolve, reject) => {
      try {

        let query = db.queryFormat(`CREATE TABLE IF NOT EXISTS ${table} (
                                    id int(11) NOT NULL AUTO_INCREMENT,
                                    username varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
                                    password varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
                                    sec_key varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
                                    user_type int(11) NOT NULL,
                                    PRIMARY KEY(id)
                                  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci
                                  AS SELECT "admin" AS username, "password" AS password, "001122" AS sec_key, 1 as user_type`);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in creating user table");
        }
        return resolve(true);
      } catch (error) {
        console.log("error in createTheTableIfNotExists->", error)
        reject(error)
      }
    });
  },

  /**
   * get all the user data form the table
   */
  getuserDataByUsername: function (username) {
    return new Promise(async (resolve, reject) => {
      try {

        // validation
        if (!username) return reject("Username is not provided");

        let query = db.queryFormat(`SELECT * FROM ${table} WHERE username = ?`, [username]);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("No Data Found");
        }
        return resolve(queryRes);
      } catch (error) {
        console.log("error in getallTableData->", error)
        reject(error)
      }
    });
  },

  /**
* get list of all admins
*/
  getListOfAdmins: function () {
    return new Promise(async (resolve, reject) => {
      try {

        let query = db.queryFormat(`SELECT id,username FROM ${table}`);
        let queryRes = await db.query(query);
        if (!queryRes) {
          return reject("no data found");
        }
        return resolve(queryRes);
      } catch (error) {
        console.log("error in getListOfAdmins->", error)
        reject(error)
      }
    });
  },

  /**
 * Insert a new user
 */
  insertNewUser: function (dataObj) {
    return new Promise(async (resolve, reject) => {
      try {

        // validation
        if (!dataObj.username) return reject("Username is not provided");
        if (!dataObj.password) return reject("Password is not provided");
        let currentEpoc = Math.floor(Date.now() / 1000)

        let query = db.queryFormat(`INSERT INTO ${table} (username, password, sec_key, user_type) VALUES (?, ?, ?, ?)`, [dataObj.username, dataObj.password, currentEpoc, dataObj.admintype]);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in insertion");
        }
        return resolve(queryRes);
      } catch (error) {
        console.log("error in insertNewUser->", error)
        reject(error)
      }
    });
  },

  /**
 * Insert a new user
 */
  updateUserpassword: function (dataObj) {
    return new Promise(async (resolve, reject) => {
      try {

        // validation
        if (!dataObj.id) return reject("id is not provided");
        if (!dataObj.username) return reject("username is not provided");
        if (!dataObj.password) return reject("Password is not provided");
        let currentEpoc = Math.floor(Date.now() / 1000)

        let query = db.queryFormat(`UPDATE ${table} SET password = ?, sec_key = ? WHERE id = ? AND username = ?`, [dataObj.password, currentEpoc, dataObj.id, dataObj.username]);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in Update");
        }
        return resolve(queryRes);
      } catch (error) {
        console.log("error in updateUserpassword->", error)
        reject(error)
      }
    });
  },

  /**
* Delete a  user
*/
  deleteUser: function (dataObj) {
    return new Promise(async (resolve, reject) => {
      try {

        // validation
        if (!dataObj.id) return reject("id is not provided");
        if (!dataObj.username) return reject("username is not provided");

        let query = db.queryFormat(`DELETE FROM ${table} WHERE id = ? AND username = ?`, [dataObj.id, dataObj.username]);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in delete");
        }
        return resolve(queryRes);
      } catch (error) {
        console.log("error in deleteUser->", error)
        reject(error)
      }
    });
  },

}

module.exports = userDataModel;