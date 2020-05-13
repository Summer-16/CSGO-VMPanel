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


const settingsModal = require("../models/panelSettingModal.js");
const vipModel = require("../models/vipModel.js");
const request = require('request');

async function sendMessageOnDiscord() {
  try {
    let data = await vipModel.getallServerData();
    let settingObj = await settingsModal.getAllSettings();

    let messageString = "Yo Bois, Here is the latest Vip List of " + settingObj.community_name + " Servers\n\n"
    for (let i = 0; i < data.length; i++) {
      if (data[i].type === 'VIPs') {
        messageString += "**#" + data[i].type + " of " + data[i].servername.toUpperCase() + " Server**\n"
        for (let j = 0; j < data[i].data.length; j++) {
          messageString += "-> " + data[i].data[j].authId.replace('"', '').replace('"', '') + "  :- " + data[i].data[j].name.replace("//", "") + "  :- ***(" + EpocToDate(data[i].data[j].expireStamp) + ")***\n"
        }
        messageString += "\n"
      }
    }
    sendMessage(messageString, settingObj.webhook_url)
  } catch (error) {
    console.log("error in sendMessageOnDiscord->", error)
  }
}

function EpocToDate(utcSeconds) {
  let d = new Date(0);
  d.setUTCSeconds(utcSeconds)

  let dd = d.getDate();
  let mm = d.getMonth() + 1;
  let yyyy = d.getFullYear();
  return dd + '-' + mm + '-' + yyyy;
}

function sendMessage(message, webhook) {

  var options = {
    'method': 'POST',
    'url': webhook,
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "embeds": [
        {
          "author": {
            "name": "Summer Soldier",
            "url": "https://github.com/Summer-16",
            "icon_url": "https://avatars0.githubusercontent.com/u/23084341?s=460&u=81ecd55c581074d6561d6250a2daa52cb7152089&v=4"
          },
          "description": message,
          "color": "14177041"
        }]
    })
  };

  console.log("****Sending Message Payload****")
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });

}

module.exports.sendMessageOnDiscord = sendMessageOnDiscord