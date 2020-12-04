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

const { dbPool } = require('../db/db_bridge');
const config = require('../config');
const usersTableName = config.usersTable

class User {
  constructor({
    id,
    username,
    userType
  }) {
    this._id = null;
    this._username = null;
    this._userType = null;
    if (id) this._id = id;
    if (username) this._username = username;
    if (userType) this._userType = userType;
  }

  async doesExists() {
  }

  async userInfo() {
    let userList = [];
    if (this._id) {
      [userList] = await dbPool.execute(`
        SELECT * FROM ${usersTableName}
        WHERE id = ?`, [this._id]);
    } else if (this._username) {
      [userList] = await dbPool.execute(`
        SELECT * FROM ${usersTableName}
        WHERE username = ?`, [this._username]);
    } else {
      throw {
        type: "actor",
        desc: "either id or username is required to retrieve user info"
      }
    }
    if (userList.length <= 0) {
      throw {
        type: "actor",
        desc: "user does not exists"
      }
    }
    return userList[0];
  }
}

module.exports = User;