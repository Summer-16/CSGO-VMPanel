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
const logger = require('../modules/logger')('Panel Admins Controller');
const userModel = require("../models/userModel.js");
const { logThisActivity } = require("../utils/activityLogger.js");
const bcrypt = require('bcrypt');
const config = require('../config');
const saltRounds = config.saltRounds;

//-----------------------------------------------------------------------------------------------------
// 

exports.addPanelAdmin = async (req, res) => {
  try {
    if (req.session.user_type === 0) {
      logThisActivity({
        "activity": "Unauthorized Access",
        "additional_info": "Someone tried to add Panel Admin",
        "created_by": req.session.username ? req.session.username : "NA"
      })
      throw "Unauthorized Access, You are not a Super Admin"
    }

    req.body.secKey = req.session.sec_key;
    let result = await addPanelAdminFunc(req.body, req.session.username);

    logThisActivity({
      "activity": "New Panel Admin added",
      "additional_info": req.body.username,
      "created_by": req.session.username
    })
    res.json({
      success: true,
      data: { "res": result, "message": req.body.submit == "insert" ? "New Admin added Successfully" : "Admin Updated Successfully", "notificationType": "success" }
    });
  } catch (error) {
    logger.error("error in addPanelAdmin->", error);
    res.json({
      success: false,
      data: { "error": error.message || error }
    });
  }
}

const addPanelAdminFunc = async (reqBody, username) => {

  let userData = await userModel.getUserDataByUsername(username);

  if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
    if (reqBody.submit === "insert") {

      //validations
      if (!reqBody.username) throw new Error("Operation Fail!, Username Missing");
      if (!reqBody.password) throw new Error("Operation Fail!, Password Missing");

      bcrypt.hash(reqBody.password, saltRounds, async function (err, hash) {
        if (err) {
          throw new Error("Error in password Encryption, Try again");
        } else {
          reqBody.password = hash;
          let insertRes = await userModel.insertNewUser(reqBody);
          if (insertRes) {
            return (insertRes);
          }
        }
      });

    } else if (reqBody.submit === "update") {

      //validations
      if (!reqBody.username) throw new Error("Operation Fail!, Username Missing");
      if (!reqBody.newPassword) throw new Error("Operation Fail!, Password Missing");

      bcrypt.hash(reqBody.newPassword, saltRounds, async function (err, hash) {
        if (err) {
          throw new Error("Error in password Encryption, Try again");
        } else {
          reqBody.newPassword = hash;
          let updateRes = await userModel.updateUserPassword({
            "id": reqBody.username.split(':')[0],
            "username": reqBody.username.split(':')[1],
            "password": reqBody.newPassword
          })
          if (updateRes) {
            return (updateRes);
          }
        }
      });
    }
  } else {
    throw new Error("Unauthorized Access, Key Missing");
  }

}

exports.addPanelAdminFunc = addPanelAdminFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.getPanelAdminsList = async (req, res) => {
  try {
    if (req.session.user_type === 0) { throw "Unauthorized Access, You are not a Super Admin" }
    req.body.secKey = req.session.sec_key
    let result = await getPanelAdminsListFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "Admin List Fetched" }
    });
  } catch (error) {
    logger.error("error in getPanelAdminsList->", error);
    res.json({
      success: false,
      data: { "error": error.message || error }
    });
  }
}

const getPanelAdminsListFunc = async () => {
  let userData = await userModel.getListOfAdmins();
  return (userData);
}

exports.getPanelAdminsListFunc = getPanelAdminsListFunc;
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.deletePanelAdmin = async (req, res) => {
  try {
    if (req.session.user_type === 0) {
      logThisActivity({
        "activity": "Unauthorized Access",
        "additional_info": "Someone tried to Delete Panel Admin",
        "created_by": req.session.username ? req.session.username : "NA"
      })
      throw "Unauthorized Access, You are not a Super Admin"
    }

    req.body.secKey = req.session.sec_key
    let result = await deletePanelAdminFunc(req.body, req.session.username);

    logThisActivity({
      "activity": "Panel Admin Deleted",
      "additional_info": req.body.username.split(':')[1],
      "created_by": req.session.username
    })
    res.json({
      success: true,
      data: { "res": result, "message": "Admin Deleted Successfully", "notificationType": "success" }
    });
  } catch (error) {
    logger.error("error in deletePanelAdmin->", error);
    res.json({
      success: false,
      data: { "error": error.message || error }
    });
  }
}

const deletePanelAdminFunc = async (reqBody, username) => {

  if (reqBody.username.split(':')[1] == username) {
    throw new Error("Did u really tried to delete yourself ?");
  } else {

    //validations
    if (!reqBody.username) throw new Error("Operation Fail!, Username Missing");

    let userData = await userModel.getUserDataByUsername(username)

    if (reqBody.secKey && reqBody.secKey === userData.sec_key) {
      if (reqBody.submit === "delete") {
        let insertRes = await userModel.deleteUser({
          "id": reqBody.username.split(':')[0],
          "username": reqBody.username.split(':')[1],
        })
        if (insertRes) {
          return (insertRes)
        }
      }
    } else {
      throw new Error("Unauthorized Access, Key Missing")
    }
  }
}

exports.deletePanelAdminFunc = deletePanelAdminFunc;
