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
const logger = require('../modules/logger')('Insert Admin Controller');

const userModel = require("../models/userModel.js");
const vipModel = require("../models/vipModel.js");
const panelServerModal = require("../models/panelServerModal.js");
const { refreshAdminsInServer } = require("../utils/refreshCFGInServer")
const { logThisActivity } = require("../utils/activityLogger.js");
var rconStatus = []

//-----------------------------------------------------------------------------------------------------
// 

exports.formAdmin = async (req, res) => {
  try {
    let serverList = await panelServerModal.getPanelServersDisplayList();
    res.render('ManageAdmin', { "serverList": serverList });
  } catch (error) {
    res.render('ManageAdmin', { "serverList": null });
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.insertAdminData = async (req, res) => {
  try {
    req.body.secKey = req.session.sec_key
    let result = await insertAdminDataFunc(req.body, req.session.username);
    logThisActivity({
      "activity": "New Admin added",
      "additional_info": `${req.body.name.replace("//", "")} ( ${req.body.steamId} )`,
      "created_by": req.session.username
    })
    res.json({
      success: true,
      data: {
        "res": result,
        "message": "New Admin added Successfully" + (rconStatus.includes(0) ? ", RCON Not Executed for all Servers" : ", RCON Executed for all Servers"),
        "notifType": "success"
      }
    });
  } catch (error) {
    logger.error("error in add Admin->", error);
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

          //validations
          if (!reqBody.steamId) return reject("Operation Fail!, Steam Id Missing");
          if (!reqBody.name) return reject("Operation Fail!, Name Missing");
          if (!reqBody.flag) return reject("Operation Fail!, Flags Missing");
          if (!reqBody.server) return reject("Operation Fail!, Server list Missing");

          let serverList = reqBody.server
          if (!Array.isArray(serverList)) return reject("Operation Fail!, Server list is not an Array");
          let allServersList = await panelServerModal.getPanelServersDisplayList();
          let serverListLength
          if (serverList.length <= allServersList.length) {
            serverListLength = serverList.length
          } else {
            return reject("Length of given server list is more then max servers added in panel, something is fishy");
          }

          reqBody.name = "//" + reqBody.name;
          reqBody.steamId = '"' + reqBody.steamId + '"';
          reqBody.day = 0;
          reqBody.userType = 1;

          let insertRes = await vipModel.insertVIPData(reqBody)
          if (insertRes) {
            for (let i = 0; i < serverListLength; i++) {
              let result = await refreshAdminsInServer(serverList[i]);
              rconStatus.push(result)
            }
            resolve(insertRes)
          }
        }
      } else {
        reject("Unauthorized Access, Key Missing")
      }
    } catch (error) {
      logger.error("error in insertAdminDataFunc->", error);
      reject(error + ", Please try again")
    }
  });
}

exports.insertAdminDataFunc = insertAdminDataFunc;
