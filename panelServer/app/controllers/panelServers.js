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
const logger = require('../modules/logger')('Panel Servers Controller');
const userModel = require("../models/userModel.js");
const panelServerModal = require("../models/panelServerModal.js");
const { logThisActivity } = require("../utils/activityLogger.js");

//-----------------------------------------------------------------------------------------------------
// 

exports.addPanelServer = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key
    let result = await addPanelServerFunc(req.body, req.session.username);

    logThisActivity({
      "activity": req.body.submit === "insert" ? "New Server added in Panel" : "Panel Server Updated",
      "additional_info": req.body.servername,
      "created_by": req.session.username
    })

    res.json({
      success: true,
      data: { "res": result, "message": req.body.submit === "insert" ? "New Server added Successfully" : "Server Data Updated Successfully" }
    });
  } catch (error) {
    logger.error("error in addPanelServer->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const addPanelServerFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {

      // validation
      if (!reqBody.tablename) return reject("Operation Fail!, Table Name is not provided");
      if (!reqBody.servername) return reject("Operation Fail!, Server Name is not provided");

      let userData = await userModel.getuserDataByUsername(username)

      if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
        if (reqBody.submit === "insert") {
          let insertRes = await panelServerModal.insertNewPanelServer(reqBody)
          if (insertRes) {
            resolve(insertRes)
          }
        } else if (reqBody.submit === "update") {
          let updateRes = await panelServerModal.updatePanelServer(reqBody)
          if (updateRes) {
            resolve(updateRes)
          }
        }
      } else {
        reject("Unauthorized Access, Key Missing")
      }
    } catch (error) {
      logger.error("error in addPanelServerFunc->", error);
      reject(error + ", Please try again")
    }
  });
}

exports.addPanelServerFunc = addPanelServerFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.getPanelServersList = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key
    let result = await getPanelServersListFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "Server List Fetched" }
    });
  } catch (error) {
    logger.error("error in getPanelServersList->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const getPanelServersListFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {

      let serverData = await panelServerModal.getPanelServersList()
      if (serverData) {
        for (let i = 0; i < serverData.length; i++) {
          serverData[i].server_rcon_pass = serverData[i].server_rcon_pass ? "Available" : "NA"
        }
        resolve(serverData)
      }
    } catch (error) {
      logger.error("error in getPanelServersListFunc->", error);
      reject(error + ", Please try again")
    }
  });
}

exports.getPanelServersListFunc = getPanelServersListFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.getPanelServerSingle = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key
    let result = await getPanelServerSingleFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "Server Data Fetched" }
    });
  } catch (error) {
    logger.error("error in getPanelServerSingle->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const getPanelServerSingleFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {

      let serverData = await panelServerModal.getPanelServerDetails(reqBody.server)
      resolve(serverData)
    } catch (error) {
      logger.error("error in getPanelServerSingleFunc->", error);
      reject(error + ", Please try again")
    }
  });
}

exports.getPanelServerSingleFunc = getPanelServerSingleFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.deletePanelServers = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key
    let result = await deletePanelServersFunc(req.body, req.session.username);

    logThisActivity({
      "activity": "Panel Server Deleted",
      "additional_info": req.body.tablename,
      "created_by": req.session.username
    })

    res.json({
      success: true,
      data: { "res": result, "message": "Server Deleted Successfully" }
    });
  } catch (error) {
    logger.error("error in deletePanelServers->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const deletePanelServersFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {

      // validation
      if (!reqBody.tablename) return reject("Operation Fail!, Table Name is not provided");
      if (!reqBody.id) return reject("Operation Fail!, Id is not provided");

      let userData = await userModel.getuserDataByUsername(username)

      if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
        if (reqBody.submit === "delete") {
          let insertRes = await panelServerModal.deletePanelServer(reqBody)
          if (insertRes) {
            resolve(insertRes)
          }
        }
      } else {
        reject("Unauthorized Access, Key Missing")
      }
    } catch (error) {
      logger.error("error in deletePanelServersFunc->", error);
      reject(error + ", Please try again")
    }
  });
}

exports.deletePanelServersFunc = deletePanelServersFunc;
