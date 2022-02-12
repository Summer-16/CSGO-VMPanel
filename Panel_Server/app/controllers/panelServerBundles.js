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
const logger = require('../modules/logger')('Panel Server Bundles Controller');
const userModel = require("../models/userModel.js");
const bundleModel = require("../models/bundleModel.js");
const { logThisActivity } = require("../utils/activityLogger.js");

//-----------------------------------------------------------------------------------------------------
// 

exports.addPanelServerBundle = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key;
    let result = await addPanelServerBundleFunc(req.body, req.session.username);

    logThisActivity({
      "activity": "New Server Bundle added in Panel",
      "additional_info": req.body.bundleName,
      "created_by": req.session.username
    })

    res.json({
      success: true,
      data: { "res": result, "message": "New Server Bundle added in Panel" }
    });
  } catch (error) {
    logger.error("error in addPanelServerBundle->", error);
    res.json({
      success: false,
      data: { "error": error.message || error }
    });
  }
}

const addPanelServerBundleFunc = async (reqBody, username) => {

  // validation
  if (reqBody.bundleServerArray < 2) throw new Error("Operation Fail!, Select at-least two servers to create a bundle");
  if (!reqBody.bundleName) throw new Error("Operation Fail!, Bundle name is Missing");
  if (!reqBody.bundlePrice) throw new Error("Operation Fail!, Bundle Price is Missing");
  if (!reqBody.bundleCurrency) throw new Error("Operation Fail!, Bundle Currency is Missing");
  if (!reqBody.bundleSubDays) throw new Error("Operation Fail!, Bundle Subscription days are Missing");
  if (!reqBody.bundleVipFlag) throw new Error("Operation Fail!, Bundle VIP Flag is Missing");

  let userData = await userModel.getUserDataByUsername(username);

  if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
    if (reqBody.submit === "insert") {
      let insertRes = await bundleModel.insertNewPanelBundle(reqBody);
      if (insertRes) {
        throw new Error(insertRes);
      }
    }
  } else {
    throw new Error("Unauthorized Access, Key Missing");
  }
}

exports.addPanelServerBundleFunc = addPanelServerBundleFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.getPanelBundlesList = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key;
    let result = await getPanelBundlesListFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "Bundles List Fetched" }
    });
  } catch (error) {
    logger.error("error in getPanelBundlesList->", error);
    res.json({
      success: false,
      data: { "error": error.message || error }
    });
  }
}

const getPanelBundlesListFunc = async () => {
  let serverData = await bundleModel.getAllBundles();
  return (serverData);
}

exports.getPanelBundlesListFunc = getPanelBundlesListFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.deletePanelBundle = async (req, res) => {
  try {

    req.body.secKey = req.session.sec_key;
    let result = await deletePanelBundleFunc(req.body, req.session.username);

    logThisActivity({
      "activity": "Panel Bundle Deleted",
      "additional_info": req.body.bundleName,
      "created_by": req.session.username
    })

    res.json({
      success: true,
      data: { "res": result, "message": "Bundle Deleted Successfully" }
    });
  } catch (error) {
    logger.error("error in deletePanelBundle->", error);
    res.json({
      success: false,
      data: { "error": error.message || error }
    });
  }
}

const deletePanelBundleFunc = async (reqBody, username) => {
  // validation
  if (!reqBody.bundleName) throw new Error("Operation Fail!, Bundle Name is not provided");
  if (!reqBody.id) throw new Error("Operation Fail!, Id is not provided");

  let userData = await userModel.getUserDataByUsername(username);

  if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
    if (reqBody.submit === "delete") {
      let deleteRes = await bundleModel.deletePanelBundle(reqBody);
      if (deleteRes) {
        return (deleteRes);
      }
    }
  } else {
    throw new Error("Unauthorized Access, Key Missing");
  }
}

exports.deletePanelBundleFunc = deletePanelBundleFunc;
