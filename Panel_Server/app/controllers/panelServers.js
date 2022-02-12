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
const logger = require('../modules/logger')('Panel Servers Controller');
const userModel = require("../models/userModel.js");
const panelServerModal = require("../models/panelServerModal.js");
const { logThisActivity } = require("../utils/activityLogger.js");

//-----------------------------------------------------------------------------------------------------
// 

exports.addPanelServer = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key;
    let result = await addPanelServerFunc(req.body, req.session.username);

    logThisActivity({
      "activity": req.body.submit === "insert" ? "New Server added in Panel" : "Panel Server Updated",
      "additional_info": req.body.serverName,
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
      data: { "error": error.message || error }
    });
  }
}

const addPanelServerFunc = async (reqBody, username) => {

  // validation
  if (!reqBody.tableName) throw new Error("Operation Fail!, Table Name is not provided");
  if (!reqBody.serverName) throw new Error("Operation Fail!, Server Name is not provided");

  let userData = await userModel.getUserDataByUsername(username);

  if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
    if (reqBody.submit === "insert") {
      let insertRes = await panelServerModal.insertNewPanelServer(reqBody);
      if (insertRes) {
        return (insertRes);
      }
    } else if (reqBody.submit === "update") {
      let updateRes = await panelServerModal.updatePanelServer(reqBody);
      if (updateRes) {
        return (updateRes);
      }
    }
  } else {
    throw new Error("Unauthorized Access, Key Missing");
  }
}

exports.addPanelServerFunc = addPanelServerFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.getPanelServersList = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key;
    let result = await getPanelServersListFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "Server List Fetched" }
    });
  } catch (error) {
    logger.error("error in getPanelServersList->", error);
    res.json({
      success: false,
      data: { "error": error.message || error }
    });
  }
}

const getPanelServersListFunc = async () => {
  let serverData = await panelServerModal.getPanelServersList();
  if (serverData) {
    for (let i = 0; i < serverData.length; i++) {
      serverData[i].server_rcon_pass = serverData[i].server_rcon_pass ? "Available" : "NA";
    }
  }
  return (serverData);
}

exports.getPanelServersListFunc = getPanelServersListFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.getPanelServerSingle = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key;
    let result = await getPanelServerSingleFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "Server Data Fetched" }
    });
  } catch (error) {
    logger.error("error in getPanelServerSingle->", error);
    res.json({
      success: false,
      data: { "error": error.message || error }
    });
  }
}

const getPanelServerSingleFunc = async (reqBody) => {
  let serverData = await panelServerModal.getPanelServerDetails(reqBody.server);
  return (serverData);
}

exports.getPanelServerSingleFunc = getPanelServerSingleFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.deletePanelServers = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key;
    let result = await deletePanelServersFunc(req.body, req.session.username);

    logThisActivity({
      "activity": "Panel Server Deleted",
      "additional_info": req.body.tableName,
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
      data: { "error": error.message || error }
    });
  }
}

const deletePanelServersFunc = async (reqBody, username) => {

  // validation
  if (!reqBody.tableName) throw new Error("Operation Fail!, Table Name is not provided");
  if (!reqBody.id) throw new Error("Operation Fail!, Id is not provided");

  let userData = await userModel.getUserDataByUsername(username);

  if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
    if (reqBody.submit === "delete") {
      let insertRes = await panelServerModal.deletePanelServer(reqBody);
      if (insertRes) {
        return (insertRes);
      }
    }
  } else {
    throw new Error("Unauthorized Access, Key Missing");
  }
}

exports.deletePanelServersFunc = deletePanelServersFunc;
