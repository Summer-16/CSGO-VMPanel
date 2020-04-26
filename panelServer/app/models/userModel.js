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


}

module.exports = userDataModel;