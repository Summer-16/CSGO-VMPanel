/* VMP-by-Summer-Soldier
*
* Copyright (C) 2022 - Shivam Parashar
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
const logger = require('../modules/logger')('Delete VIP controller');
const vipModel = require("../models/vipModel.js");
const userModel = require("../models/userModel.js");
const { refreshAdminsInServer } = require("../utils/refreshCFGInServer")
const { logThisActivity } = require("../utils/activityLogger.js");
var rconStatus;

//-----------------------------------------------------------------------------------------------------
// 

exports.deleteVipData = async (req, res) => {
  try {
    req.body.secKey = req.session.sec_key
    let result = await deleteVipDataFunc(req.body, req.session.username);
    logThisActivity({
      "activity": "VIP deleted",
      "additional_info": req.body.primaryKey,
      "created_by": req.session.username
    })
    res.json({
      success: true,
      data: {
        "res": result,
        "message": "VIP deleted Successfully" + (rconStatus ? ", RCON Executed" : ", RCON Not Executed"),
        "notificationType": "success"
      }
    });
  } catch (error) {
    logger.error("error in delete vip->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const deleteVipDataFunc = async (reqBody, username) => {
  let userData = await userModel.getUserDataByUsername(username)

  if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
    reqBody.primaryKey = '"' + reqBody.primaryKey + '"'
    let deleteRes = await vipModel.deleteVipByAdmin(reqBody)
    if (deleteRes) {
      rconStatus = await refreshAdminsInServer(reqBody.tableName);
      return (deleteRes)
    }
  } else {
    throw new Error("Unauthorized Access, Key Missing")
  }
}

exports.deleteVipDataFunc = deleteVipDataFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.deleteOldVipData = async (req, res) => {
  try {

    let result = await deleteOldVipDataFunc(req.session.username, req.session.sec_key);
    logThisActivity({
      "activity": "Manual Refresh Executed",
      "additional_info": "Old VIPs and deleted and new data is updated in servers",
      "created_by": req.session.username
    })
    res.json({
      success: true,
      data: {
        "res": result,
        "message": "Operation Successfully Executed",
        "notificationType": "success"
      }
    });
  } catch (error) {
    logger.error("error in delete vip->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const deleteOldVipDataFunc = async (username, secKey) => {
  let userData = await userModel.getUserDataByUsername(username)

  if (secKey && secKey === userData.sec_key) {
    let deleteRes = await vipModel.deleteOldVip()
    if (deleteRes) {
      return (deleteRes)
    }
  } else {
    throw new Error("Unauthorized Access, Key Missing")
  }
}

exports.deleteOldVipDataFunc = deleteOldVipDataFunc;