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
const logger = require('../modules/logger')('VIP Controller');

const vipModel = require("../models/vipModel.js");
const myDashboardModel = require("../models/myDashboardModel.js");
const panelServerModal = require("../models/panelServerModal.js");
const settingsModal = require("../models/panelSettingModal.js");

//-----------------------------------------------------------------------------------------------------
// 

exports.dashboard = async (req, res) => {
  try {
    const token = req.session.token
    let result = await dashboardFunc(req.body, token);
    res.render('Dashboard', result);
  } catch (error) {
    logger.error("error in dashboard->", error);
    res.render('Dashboard', { "vipData": null, "adminStats": null, "serverData": null });
  }
}

const dashboardFunc = (reqBody, token) => {
  return new Promise(async (resolve, reject) => {
    try {

      let data = null, adminStats = null, serverData = null

      if (token) {
        data = await vipModel.getallServerData()
        adminStats = await myDashboardModel.getStatsForAdmin()
      } else {
        let settingObj = await settingsModal.getAllSettings();
        if (settingObj.dash_vip_show) {
          data = await vipModel.getallServerData()
        }
      }
      serverData = await panelServerModal.getPanelServersList()
      if (serverData) {
        for (let i = 0; i < serverData.length; i++) {
          serverData[i].server_rcon_pass = serverData[i].server_rcon_pass ? "Available" : "NA"
        }
      }
      resolve({ "vipData": data, "adminStats": adminStats, "serverData": serverData })
    } catch (error) {
      logger.error("error in dashboardFunc->", error);
      reject(error)
    }
  });
}

exports.dashboardFunc = dashboardFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.getVipsDataSingleServer = async (req, res) => {
  try {
    let result = await getVipsDataSingleServerFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "VIP Listing loaded for " + req.body.server.toUpperCase(), "notifType": "info" }
    });
  } catch (error) {
    logger.error("error in getVipsDataSingleServer->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const getVipsDataSingleServerFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {

      //validations
      if (!reqBody.server && !reqBody.searchKey) return reject("Operation Fail!, Server Missing");
      if (reqBody.server) {
        let data = await vipModel.getsingleServerData(reqBody.server, reqBody.searchKey, "vip")

        for (let i = 0; i < data.length; i++) {
          data[i].server = reqBody.server
          data[i].serverName = reqBody.serverName
        }
        resolve(data)
      } else if (!reqBody.server && reqBody.searchKey) {
        let serverData = await panelServerModal.getPanelServersList()
        let finalResult = []

        for (let i = 0; i < serverData.length; i++) {
          let data = await vipModel.getsingleServerData(serverData[i].tbl_name, reqBody.searchKey, "vip")
          for (let j = 0; j < data.length; j++) {
            data[j].server = serverData[i].tbl_name
            data[j].serverName = serverData[i].server_name
          }
          finalResult = [...finalResult, ...data]
        }
        resolve(finalResult)
      } else {
        return reject("Something went wrong")
      }

    } catch (error) {
      logger.error("error in getVipsDataSingleServerFunc->", error);
      reject(error)
    }
  });
}

exports.getVipsDataSingleServerFunc = getVipsDataSingleServerFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.getAdminsDataSingleServer = async (req, res) => {
  try {
    let result = await getAdminsDataSingleServerFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "Admins Listing loaded for " + req.body.server.toUpperCase(), "notifType": "info" }
    });
  } catch (error) {
    logger.error("error in getAdminsDataSingleServerFunc->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const getAdminsDataSingleServerFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {

      //validations
      if (!reqBody.server && !reqBody.searchKey) return reject("Operation Fail!, Server Missing");
      if (reqBody.server) {
        let data = await vipModel.getsingleServerData(reqBody.server, reqBody.searchKey, "admin")

        for (let i = 0; i < data.length; i++) {
          data[i].server = reqBody.server
          data[i].serverName = reqBody.serverName
        }
        resolve(data)
      } else if (!reqBody.server && reqBody.searchKey) {
        let serverData = await panelServerModal.getPanelServersList()
        let finalResult = []

        for (let i = 0; i < serverData.length; i++) {
          let data = await vipModel.getsingleServerData(serverData[i].tbl_name, reqBody.searchKey, "admin")
          for (let j = 0; j < data.length; j++) {
            data[j].server = serverData[i].tbl_name
            data[j].serverName = serverData[i].server_name
          }
          finalResult = [...finalResult, ...data]
        }
        resolve(finalResult)
      } else {
        return reject("Something went wrong")
      }
    } catch (error) {
      logger.error("error in getAdminsDataSingleServerFunc->", error);
      reject(error)
    }
  });
}

exports.getAdminsDataSingleServerFunc = getAdminsDataSingleServerFunc;