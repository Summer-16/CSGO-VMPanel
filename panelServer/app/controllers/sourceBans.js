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
const logger = require('../modules/logger')('Source Bans');

const panelServerModal = require("../models/panelServerModal.js");
const { executeRconInServer } = require("../utils/csgoServerRconExecuter")
const { logThisActivity } = require("../utils/activityLogger.js");
const userModel = require("../models/userModel.js");

var rconStatus = []

//-----------------------------------------------------------------------------------------------------
// 

exports.sourceBans = async (req, res) => {
  try {
    let serverList = await panelServerModal.getPanelServersDisplayList();
    res.render('sourceBans', { "serverList": serverList });
  } catch (error) {
    logger.error("error in sourceBans-->", error);
    res.render('sourceBans', { "serverList": null });
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.sourceBansAddBan = async (req, res) => {
  try {
    req.body.secKey = req.session.sec_key
    let result = await sourceBansAddBanFunc(req.body, req.session.username);
    logThisActivity({
      "activity": req.body.bantype == "serverBan" ? "New Server Ban Added" : "New Comm Ban Added",
      "additional_info": (req.body.bantype == "serverBan" ?
        `${req.body.username} (${req.body.steamid}) banned for ${req.body.banlength} Minutes` :
        `${req.body.username} (${req.body.steamid}) Comm Banned for ${req.body.banlength} Minutes`),
      "created_by": req.session.username
    })
    res.json({
      success: true,
      data: {
        "res": result,
        "message": req.body.bantype == "serverBan" ? "Serevr Ban added Successfully" : "Comm Ban added Successfully",
        "notifType": "success"
      }
    });
  } catch (error) {
    logger.error("error in adding ban in sourceBansAddBan->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const sourceBansAddBanFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {

      let userData = await userModel.getuserDataByUsername(username)

      if (reqBody.secKey && reqBody.secKey === userData.sec_key) {

        logger.info("req body in  sourceBansAddBanFunc==> ", reqBody);

        if (reqBody.bantype === "serverBan") {
          if (reqBody.serverbantype == "steamid") {
            const banCommand = `sm_addban ${reqBody.banlength} ${reqBody.steamid} [${reqBody.banreason}]`
            await executeRconInServer(reqBody.banserver, banCommand)
            resolve("Ban Added")
          } else {
            return reject("Wrong ban type passed in API")
          }
        } else if (reqBody.bantype === "commBan") {

          if (reqBody.commbantype == "chatonly") {
            const banCommand = `sm_gag #${reqBody.steamid}|${reqBody.username} ${reqBody.banlength} [${reqBody.banreason}]`
            await executeRconInServer(reqBody.banserver, banCommand)
            resolve("Ban Added")
          } else if (reqBody.commbantype == "voiceonly") {
            const banCommand = `sm_mute #${reqBody.steamid}|${reqBody.username} ${reqBody.banlength} [${reqBody.banreason}]`
            await executeRconInServer(reqBody.banserver, banCommand)
            resolve("Ban Added")
          } else if (reqBody.commbantype == "chatandvoice") {
            const banCommand = `sm_unsilence #${reqBody.steamid}|${reqBody.username} ${reqBody.banlength} [${reqBody.banreason}]`
            await executeRconInServer(reqBody.banserver, banCommand)
            resolve("Ban Added")
          } else {
            return reject("Wrong ban type passed in API")
          }
        } else {
          return reject("Wrong ban type passed in API")
        }
      } else {
        reject("Unauthorized Access, Key Missing")
      }
    } catch (error) {
      logger.error("error in sourceBansAddBanFunc->", error);
      reject(error + ", Please try again")
    }
  });
}

exports.sourceBansAddBanFunc = sourceBansAddBanFunc;
//-----------------------------------------------------------------------------------------------------
