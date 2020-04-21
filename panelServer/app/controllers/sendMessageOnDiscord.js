/* Vip-Management-System-By-SUMMER_SOLDIER
*
* Copyright (C) 2020 SUMMER SOLDIER
*
* This file is part of Vip-Management-System-By-SUMMER_SOLDIER
*
* Vip-Management-System-By-SUMMER_SOLDIER is free software: you can redistribute it and/or modify it
* under the terms of the GNU General Public License as published by the Free
* Software Foundation, either version 3 of the License, or (at your option)
* any later version.
*
* Vip-Management-System-By-SUMMER_SOLDIER is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License along with
* Vip-Management-System-By-SUMMER_SOLDIER. If not, see http://www.gnu.org/licenses/.
*/

const config = require('../config/config.json')
const webhook = config.webhook;
const vipModel = require("../models/vipModel.js");
const request = require('request');

function sendMessageOnDiscord() {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await vipModel.getallServerData()
      let messageString = "Hey here is the latest Vip List of GanGGaminG Server\n\n"
      for (let i = 0; i < data.length; i++) {
        messageString += "**#Vip Details of " + data[i].name.toUpperCase() + " Server**\n"
        for (let j = 0; j < data[i].data.length; j++) {
          messageString += "-> " + data[i].data[j].authId.replace('/"/g', "") + "  :- " + data[i].data[j].name.replace("//", "") + "  :- ***(" + EpocToDate(data[i].data[j].expireStamp) + ")***\n"
        }
        messageString += "\n"
      }
      sendMessage(messageString)
    } catch (error) {
      console.log("error in sendMessageOnDiscord->", error)
      reject(error)
    }
  });
}

function EpocToDate(utcSeconds) {
  let d = new Date(0);
  d.setUTCSeconds(utcSeconds)

  let dd = d.getDate();
  let mm = d.getMonth() + 1;
  let yyyy = d.getFullYear();
  return mm + '-' + dd + '-' + yyyy;
}

function sendMessage(message) {
  var options = {
    'method': 'POST',
    'url': 'https://discordapp.com/api/webhooks/573445824965509121/Nd-eeX35tRWPtCdJzGgV7AC79fzsQMOZauxkJLJkk79ChCqYZMgqwCctwaek_XtvKa4k',
    'headers': {
      'Content-Type': 'application/json',
      'Cookie': '__cfduid=d49450082a303e89b0cf1067962ca64721587413688; __cfruid=175ad1a6c7ccdf59e3cb0ee9eded81889f66399d-1587413688'
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
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });

}

module.exports.sendMessageOnDiscord = sendMessageOnDiscord