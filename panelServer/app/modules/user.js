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