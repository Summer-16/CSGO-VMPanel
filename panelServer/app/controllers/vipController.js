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

const vipModel = require("../models/vipModel.js");

exports.getVipsData = async (req, res) => {
  try {
    let result = await getVipsDataFunc(req.body);
    res.render('Dashboard', { "vipData": result });
  } catch (error) {
    console.log("error in getVipsData->", error)
    res.render('Dashboard', { "vipData": null });
  }
}

const getVipsDataFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await vipModel.getallServerData()
      resolve(data)
    } catch (error) {
      console.log("error in getVipsDataFunc->", error)
      reject(error)
    }
  });
}

exports.getVipsDataFunc = getVipsDataFunc;

//-----------------------------------------------------------------------

exports.getVipsDataSingleServer = async (req, res) => {
  try {
    let result = await getVipsDataSingleServerFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "VIP Listing loaded for " + req.body.server.toUpperCase() }
    });
  } catch (error) {
    console.log("error in getVipsDataSingleServer->", error)
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const getVipsDataSingleServerFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await vipModel.getsingleServerData(reqBody.server, "vip")
      resolve(data)
    } catch (error) {
      console.log("error in getVipsDataSingleServerFunc->", error)
      reject(error)
    }
  });
}

exports.getVipsDataSingleServerFunc = getVipsDataSingleServerFunc;

//-----------------------------------------------------------------------

exports.getAdminsDataSingleServer = async (req, res) => {
  try {
    let result = await getAdminsDataSingleServerFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "Admins Listing loaded for " + req.body.server.toUpperCase() }
    });
  } catch (error) {
    console.log("error in getAdminsDataSingleServerFunc->", error)
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const getAdminsDataSingleServerFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await vipModel.getsingleServerData(reqBody.server, "admin")
      resolve(data)
    } catch (error) {
      console.log("error in getAdminsDataSingleServerFunc->", error)
      reject(error)
    }
  });
}

exports.getAdminsDataSingleServerFunc = getAdminsDataSingleServerFunc;