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
const config = require('../config/config.json')
const serverList = config.servers;
const userModel = require("../models/userModel.js");
const vipModel = require("../models/vipModel.js");

// -----------------------------------------------------------------------------------------

exports.formAdmin = async (req, res) => {
  try {
    res.render('ManageAdmin', { "serverList": serverList });
  } catch (error) {
    res.render('ManageAdmin', { "serverList": null });
  }
}

// -----------------------------------------------------------------------------------------

exports.insertAdminData = async (req, res) => {
  try {
    let result = await insertAdminDataFunc(req.body, req.session.username);
    res.json({
      success: true,
      data: { "res": result, "message": "New Admin added Successfully" }
    });
  } catch (error) {
    console.log("error in add Admin->", error)
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const insertAdminDataFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {

      let userData = await userModel.getuserDataByUsername(username)

      if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
        if (reqBody.submit === "insert") {
          console.log("reqBody in insertAdminDataFunc->", reqBody)
          reqBody.name = "//" + reqBody.name
          reqBody.steamId = '"' + reqBody.steamId + '"'
          reqBody.flag = '"' + reqBody.flag + '"'
          reqBody.day = 0

          let insertRes = await vipModel.insertVIPData(reqBody)
          if (insertRes) {
            resolve(insertRes)
          }
        }

      } else {
        reject("Unauthorized Access, Key Missing")
      }
    } catch (error) {
      console.log("error in insertAdminDataFunc->", error)
      reject(error + ", Please try again")
    }
  });
}

// -----------------------------------------------------------------------------------------

exports.insertAdminDataFunc = insertAdminDataFunc;
