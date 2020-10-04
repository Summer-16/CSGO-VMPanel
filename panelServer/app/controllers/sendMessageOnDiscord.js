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
const logger = require('../modules/logger')('Send Message Discord Controller');

const settingsModal = require("../models/panelSettingModal.js");
const vipModel = require("../models/vipModel.js");
const { wait } = require('../utils/misc.js');
const needle = require('needle');

const GAcolor = [1752220, 3066993, 3447003, 10181046, 15105570, 15158332, 9807270, 8359053, 3426654, 1146986, 2067276, 2123412, 7419530, 11027200, 10038562, 9936031, 12370112, 2899536, 16580705, 12320855]

//-----------------------------------------------------------------------------------------------------
// 

async function sendMessageOnDiscord() {
  try {
    const color = [...GAcolor];
    let settingObj = await settingsModal.getAllSettings();
    if (!settingObj.webhook_url) {
      return "Webhook not found"
    }
    let data = await vipModel.getallServerData();

    let messageString = "", messageArray = [], count = 0, colorArray = []

    for (let i = 0; i < data.length; i++) {

      if (data[i].type == "VIPs" || (data[i].type == "ADMINs" && settingObj.dash_admin_show == 1)) {

        let ranNum = getRandomInt(19);
        let roll = color.splice(ranNum, 1);
        let currentColor = roll[0];

        if (data[i].type == "VIPs") {
          messageString = "**" + data[i].type + " of " + data[i].servername + " Server**\n**- Name  , Steam Id  , Sub. End Date , Days left**\n";
        } else {
          messageString = "**" + data[i].type + " of " + data[i].servername + " Server**\n**- Name  , Steam Id**\n";
        }

        if (data[i].data.length) {

          count = 0;

          for (let j = 0; j < data[i].data.length; j++) {

            if (count <= 10) {

              if (data[i].type == "VIPs") {
                messageString += "- " + data[i].data[j].name.replace("//", "")
                  + "  :- " + data[i].data[j].authId.replace('"', '').replace('"', '')
                  + "  :- ***(" + EpocToDate(data[i].data[j].expireStamp) + ")***"
                  + "  :- " + remainingDays(data[i].data[j].expireStamp) + " days left\n"
              } else {
                messageString += "- " + data[i].data[j].name.replace("//", "")
                  + "  :- " + data[i].data[j].authId.replace('"', '').replace('"', '') + "\n"
              }

              count++
            } else {

              messageArray.push(messageString);
              colorArray.push(currentColor)
              count = 0;

              if (data[i].type == "VIPs") {
                messageString = "**" + data[i].type + " of " + data[i].servername + " Server Continue**\n**- Name  , Steam Id  , Sub. End Date , Days left**\n";
              } else {
                messageString = "**" + data[i].type + " of " + data[i].servername + " Server Continue**\n**- Name  , Steam Id**\n";
              }

            }
          }
          messageArray.push(messageString)
          colorArray.push(currentColor)

        }
        messageString = ""
      }
    }
    sendMessage(messageArray, colorArray, settingObj.webhook_url)
  } catch (error) {
    logger.error("error in sendMessageOnDiscord->", error);
  }
}
//-----------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------
async function sendBuyMessageOnDiscord(data, finalUserName) {
  try {
    let settingObj = await settingsModal.getAllSettings();
    if (!settingObj.webhook_url) {
      return "Webhook not found"
    }
    if (settingObj.salenotification_discord / 1) {
      let saleType = (data.buyType === 'newPurchase') ? "VIP Purchased" : "VIP Renewed"
      let paymentId = (data.gateway === 'paypal') ? data.paymentData.id : (data.gateway === 'payu') ? data.paymentData.order_id : "NA"
      let serverName = data.serverData.server_name
      let productDesc = data.paymentData.product_desc
      let amount

      if (data.gateway === 'paypal') {
        amount = data.paymentData.purchase_units[0].amount.value
      } else if (data.gateway === 'payu') {
        amount = data.payuData.amount
      }

      let messageString = `**New ${saleType}**
                          Buyer Name: ${finalUserName}
                          Server Name: ${serverName}
                          Product Desc: ${productDesc}
                          Paid Amount: ${amount}
                          Order/Txn Id: ${paymentId}
                          Paymnet Through: ${data.gateway.toUpperCase()}
                          `

      sendMessage([messageString], [(data.buyType === 'newPurchase') ? 3066993 : 3447003], settingObj.webhook_url)
    }

  } catch (error) {
    logger.error("error in sendBuyMessageOnDiscord->", error);
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------

async function sendMessage(message, color, webhook) {

  for (let i = 0; i < message.length; i++) {
    const options = {
      "json": true,
      "headers": {
        "Content-Type": "application/json",
      },
    };
    const body = {
      "embeds": [
        {
          "author": {
            "name": "Notification by VMPanel",
            "url": "https://github.com/Summer-16/CSGO-VMPanel",
            "icon_url": "https://raw.githubusercontent.com/Summer-16/CSGO-VMPanel/master/panelServer/public/images/icon.png"
          },
          "timestamp": new Date(),
          "footer": {
            "text": "VMPanel made with ❤️ by SummerSoldier"
          },
          "description": message[i],
          "color": color[i]
        }]
    }
    logger.info("****Sending Message Payload****");
    try {
      const response = await needle('post', webhook, body, options);
      logger.info("Discord send message request status-->", response.statusCode);
      await wait(2000);
    } catch (error) {
      logger.error(error);
    }
  }
}

module.exports.sendMessageOnDiscord = sendMessageOnDiscord
module.exports.sendBuyMessageOnDiscord = sendBuyMessageOnDiscord
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

function EpocToDate(utcSeconds) {
  let d = new Date(0);
  d.setUTCSeconds(utcSeconds)
  let dd = d.getDate();
  let mm = d.getMonth() + 1;
  let yyyy = d.getFullYear();
  return dd + '-' + mm + '-' + yyyy;
}

function remainingDays(endEpoc) {
  const date1 = new Date();
  const date2 = new Date(0);
  date2.setUTCSeconds(endEpoc)
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
