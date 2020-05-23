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
const SteamIDConverter = require('../utils/steamIdConvertor')
const myDashboardModel = require("../models/myDashboard.js");
const panelServerModal = require("../models/panelServerModal.js");

//-----------------------------------------------------------------------------------------------------
// 

exports.myDashboard = async (req, res) => {
  try {
    let result = await myDashboardFunc(req.body, req.user);
    res.render('UserDashboard', result);
  } catch (error) {
    console.log("error in myDashboard->", error)
    res.render('UserDashboard', { "userData": null });
  }
}

const myDashboardFunc = (reqBody, reqUser) => {
  return new Promise(async (resolve, reject) => {
    try {

      // console.log("reqBody-->", reqBody)
      // console.log("reqUser-->", reqUser)

      const steamId = SteamIDConverter.toSteamID(reqUser.id);
      const userData = {
        "steamId": steamId,
        "displayname": reqUser.displayName,
        "realName": reqUser._json.realname,
        "avatarUrl": reqUser.photos[2].value
      }

      let userDataListing = await myDashboardModel.getUserDataFromAllServers('"' + steamId + '"')
      let serverList = await panelServerModal.getPanelServersDisplayList()

      const userServerArray = []
      for (let j = 0; j < userDataListing.length; j++) {
        userServerArray.push(userDataListing[j].servername)
      }

      const serverArray = []
      for (let i = 0; i < serverList.length; i++) {
        if (userServerArray.includes(serverList[i].server_name)) {
          //do nothing
        } else {
          serverArray.push(serverList[i])
        }
      }

      resolve({ "userDataListing": userDataListing, "userData": userData, "serverArray": serverArray })

    } catch (error) {
      console.log("error in myDashboardFunc->", error)
      reject(error)
    }
  });
}

exports.myDashboardFunc = myDashboardFunc;
//-----------------------------------------------------------------------------------------------------