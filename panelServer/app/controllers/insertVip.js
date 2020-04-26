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
const vipModel = require("../models/vipModel.js");
const userModel = require("../models/userModel.js");
const { getVipsDataFunc } = require("./vipController.js")

// -----------------------------------------------------------------------------------------

exports.form = async (req, res) => {
  try {
    //let result = await getVipsDataFunc(req.body);
    res.render('insert', { "serverList": serverList, "vipData": "" });
  } catch (error) {
    console.log(error)
    res.render('404')
  }
}

// -----------------------------------------------------------------------------------------

exports.insertVipData = async (req, res) => {
  try {
    let result = await insertVipDataFunc(req.body, req.session.username);
    res.render('success', { result: JSON.stringify(result) });
  } catch (error) {
    console.log(error)
    res.render('unauth', { "error": error })
  }
}

const insertVipDataFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {

      let userData = await userModel.getuserDataByUsername(username)

      if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
        reqBody.day = reqBody.day / 1
        if (reqBody.submit === "insert") {
          reqBody.day = epoctillExpirey(reqBody.day)
          reqBody.name = "//" + reqBody.name
          reqBody.steamId = '"' + reqBody.steamId + '"'
          let insertRes = await vipModel.insertVIPData(reqBody)
          if (insertRes) {
            resolve(insertRes)
          }
        } else if (reqBody.submit === "update") {
          reqBody.day = Math.floor(reqBody.day * 86400)
          let updateRes = await vipModel.updateVIPData(reqBody)
          if (updateRes) {
            resolve(updateRes)
          }
        } else {
          reject("Unauthorized Access")
        }
      } else {
        reject("Unauthorized Access")
      }
    } catch (error) {
      console.log("error in insertVipDataFunc->", error)
      reject(error)
    }
  });
}

function epoctillExpirey(days) {
  let currentEpoc = Math.floor(Date.now() / 1000)
  let daysinSec = Math.floor(days * 86400)
  return (currentEpoc + daysinSec)
}

// -----------------------------------------------------------------------------------------

exports.insertVipDataFunc = insertVipDataFunc;
