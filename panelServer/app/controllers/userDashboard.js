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
const myDashboardModel = require("../models/myDashboardModel.js");
const salesModal = require("../models/salesModel.js");
const vipModel = require("../models/vipModel.js");
const { refreshAdminsInServer } = require("../utils/refreshCFGInServer")
const config = require('../config/config.json')
const paypalClientID = config.paypal_client_id

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

      const steamId = SteamIDConverter.toSteamID(reqUser.id);
      const userData = {
        "steamId": steamId,
        "displayname": reqUser.displayName,
        "realName": reqUser._json.realname,
        "avatarUrl": reqUser.photos[2].value
      }

      let userDataListing = await myDashboardModel.getUserDataFromAllServers('"' + steamId + '"')

      let serverList = await myDashboardModel.getSaleServerListing()

      const userServerArray = []
      for (let j = 0; j < userDataListing.length; j++) {
        userServerArray.push(userDataListing[j].servername)
      }

      const serverArray = []
      for (let i = 0; i < serverList.length; i++) {
        if (userServerArray.includes(serverList[i].server_name)) {
          for (let k = 0; k < userDataListing.length; k++) {
            if (userDataListing[k].servername == serverList[i].server_name) {
              userDataListing[k].serverdata = serverList[i]
            }
          }
        } else {
          serverArray.push(serverList[i])
        }
      }

      resolve({
        "userDataListing": userDataListing,
        "userData": userData,
        "serverArray": serverArray,
        "paypalActive": paypalClientID ? true : false,
        "paypalClientID": paypalClientID
      })

    } catch (error) {
      console.log("error in myDashboardFunc->", error)
      reject(error)
    }
  });
}

exports.myDashboardFunc = myDashboardFunc;
//-----------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------
// 

exports.afterPaymentProcess = async (req, res) => {
  try {
    const secKey = req.session.passport.user.id
    let result = await afterPaymentProcessFunc(req.body, req.user, secKey);
    res.json({
      success: true,
      data: {
        "res": result,
        "message": "All Operations Done Successfully, Refreshing page in 5 Seconds",
        "notifType": "success"
      }
    });
  } catch (error) {
    console.log("error in afterPaymentProcess->", error)
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const afterPaymentProcessFunc = (reqBody, reqUser, secKey) => {
  return new Promise(async (resolve, reject) => {
    try {

      const steamId = SteamIDConverter.toSteamID(reqUser.id);
      const userDisplayname = reqUser.displayName
      const saleType = reqBody.buyType === 'newPurchase' ? 1 : reqBody.buyType === 'renewPurchase' ? 2 : 0
      const serverTable = reqBody.serverData.tbl_name
      const flag = reqBody.serverData.vip_flag
      const paymentData = reqBody.paymentData

      const paymentInsertObj = {
        order_id: paymentData.id,
        payer_id: paymentData.payer.payer_id,
        payer_steamid: steamId,
        payer_email: paymentData.payer.email_address,
        payer_name: paymentData.payer.name.given_name,
        payer_surname: paymentData.payer.name.surname,
        product_desc: paymentData.purchase_units[0].description,
        amount_paid: paymentData.purchase_units[0].amount.value,
        amount_currency: paymentData.purchase_units[0].amount.currency_code,
        status: paymentData.status,
        sale_type: saleType
      }

      await salesModal.insertNewSaleRecord(paymentInsertObj)

      if (reqBody.buyType === 'newPurchase') {

        const newVipInsertObj = {
          day: epoctillExpirey(30),
          name: "//" + userDisplayname,
          steamId: '"' + steamId + '"',
          userType: 0,
          flag: flag,
          server: [serverTable],
          secKey: secKey
        }

        let insertRes = await vipModel.insertVIPData(newVipInsertObj)
        if (insertRes) {
          for (let i = 0; i < newVipInsertObj.server.length; i++) {
            await refreshAdminsInServer(newVipInsertObj.server[i]);
          }
          resolve(insertRes)
        }
      } else if (reqBody.buyType === 'renewPurchase') {

        const updateVipObj = {
          day: Math.floor(30 * 86400),
          steamId: '"' + steamId + '"',
          server: [serverTable],
          secKey: secKey
        }

        let updateRes = await vipModel.updateVIPData(updateVipObj)
        if (updateRes) {
          for (let i = 0; i < updateVipObj.server.length; i++) {
            await refreshAdminsInServer(updateVipObj.server[i]);
          }
          resolve(updateRes)
        }
      } else {
        reject("Something Went Wrong")
      }
    } catch (error) {
      console.log("error in afterPaymentProcessFunc->", error)
      reject(error + ", Please try again")
    }
  });
}

exports.afterPaymentProcessFunc = afterPaymentProcessFunc;
//-----------------------------------------------------------------------------------------------------

function epoctillExpirey(days) {
  let currentEpoc = Math.floor(Date.now() / 1000)
  let daysinSec = Math.floor(days * 86400)
  return (currentEpoc + daysinSec)
}