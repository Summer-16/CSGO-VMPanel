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
const settingsModal = require("../models/panelSettingModal.js");

// -----------------------------------------------------------------------------------------

exports.PanelSettings = async (req, res) => {
  try {
    res.render('PanelSetting');
  } catch (error) {
    console.log("Error in PanelSettings->", error)
    res.render('PanelSetting');
  }
}

// -----------------------------------------------------------------------------------------

exports.fetchPanelSettings = async (req, res) => {
  try {
    let result = await fetchPanelSettingsFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "Panel settings Fetched" }
    });
  } catch (error) {
    console.log("error in add/update vip->", error)
    res.json({
      success: false,
      data: { "error": error, "message": "Error in fetching Panel settings" }
    });
  }
}

const fetchPanelSettingsFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await settingsModal.getAllSettings()
      resolve(data)
    } catch (error) {
      console.log("error in fetchPanelSettingsFunc->", error)
      reject(error)
    }
  });
}

exports.fetchPanelSettingsFunc = fetchPanelSettingsFunc;

// -----------------------------------------------------------------------------------------

exports.updatePanelSettings = async (req, res) => {
  try {
    await updatePanelSettingsFunc(req.body);
    res.redirect('PanelSetting');
  } catch (error) {
    console.log("Error in PanelSettings->", error)
    res.render('PanelSetting');
  }
}

const updatePanelSettingsFunc = (reqBody, username) => {
  return new Promise(async (resolve, reject) => {
    try {

      let keyArray = Object.keys(reqBody)
      for (let i = 0; i < keyArray.length; i++) {
        await settingsModal.updatesetting(keyArray[i], reqBody[keyArray[i]])
      }
      resolve(true)
    } catch (error) {
      console.log("error in updatePanelSettingsFunc->", error)
      reject(error + ", Please try again")
    }
  });
}