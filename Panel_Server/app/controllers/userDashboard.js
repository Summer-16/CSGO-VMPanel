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
const logger = require('../modules/logger')('User Dashboard');

const SteamIDConverter = require('../utils/steamIdConvertor')
const myDashboardModel = require("../models/myDashboardModel.js");
const salesModal = require("../models/salesModel.js");
const vipModel = require("../models/vipModel.js");
const { refreshAdminsInServer } = require("../utils/refreshCFGInServer")
const { logThisActivity } = require("../utils/activityLogger.js");
const config = require('../config');
const paypalClientID = config.payment_gateways.paypal.paypal_client_id
const payUConfig = config.payment_gateways.payU
const crypto = require('crypto');
const { getPanelBundlesListFunc } = require('./panelServerBundles.js')
const { sendBuyMessageOnDiscord } = require('./sendMessageOnDiscord.js')
const panelServerModal = require("../models/panelServerModal.js");

//-----------------------------------------------------------------------------------------------------
// 

exports.myDashboard = async (req, res) => {
  try {
    let result = await myDashboardFunc(req.body, req.user);
    res.render('UserDashboard', result);
  } catch (error) {
    logger.error("error in myDashboard->", error);
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
      let allServerList = await panelServerModal.getPanelServersList();

      const userServerArray = []
      // for (let j = 0; j < userDataListing.length; j++) {
      //   userServerArray.push(userDataListing[j].servername)
      // }

      for (let k = 0; k < userDataListing.length; k++) {
        userServerArray.push(userDataListing[k].servername)

        for (let l = 0; l < allServerList.length; l++) {
          if (userDataListing[k].servername == allServerList[l].server_name) {
            userDataListing[k].serverdata = allServerList[l]
          }
        }
      }

      const serverArray = []
      for (let i = 0; i < serverList.length; i++) {
        if (!userServerArray.includes(serverList[i].server_name)) {
          serverArray.push(serverList[i])

        }
        //  else {
        //   serverArray.push(serverList[i])
        // }
      }

      let bundleList = await getPanelBundlesListFunc()

      const bundleArray = []
      for (let i = 0; i < bundleList.length; i++) {

        let serversTblNames = []
        for (let j = 0; j < bundleList[i].bundleServersData.length; j++) {
          serversTblNames.push(bundleList[i].bundleServersData[j].tbl_name)
        }

        let serverDataObj = {
          "id": bundleList[i].id,
          "server_ip": "-",
          "server_port": "-",
          "server_name": bundleList[i].bundle_name,
          "vip_price": bundleList[i].bundle_price,
          "vip_currency": bundleList[i].bundle_currency,
          "vip_days": bundleList[i].bundle_sub_days,
          "tbl_name": serversTblNames.join(','),
          "vip_flag": bundleList[i].bundle_flags
        }

        bundleList[i]["serverDataObj"] = serverDataObj
        bundleArray.push(bundleList[i])

      }

      resolve({
        "userDataListing": userDataListing,
        "userData": userData,
        "serverArray": serverArray,
        "bundleArray": bundleArray,
        "paypalActive": paypalClientID ? true : false,
        "paypalClientID": paypalClientID,
        "payuActive": (payUConfig.enabled == true || payUConfig.enabled == "true") ? true : false,
        "payuEnv": payUConfig.environment
      })

    } catch (error) {
      logger.error("error in myDashboardFunc->", error);
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

    let userDisplayname = req.user.displayName
    userDisplayname = cleanString(userDisplayname)
    let userRealName = req.user._json.realname
    const finalUserName = userRealName + " - (" + (userDisplayname ? userDisplayname : "-_-") + ")"

    logThisActivity({
      "activity": req.body.buyType === 'newPurchase' ? "New VIP Purchased" : "VIP renewed",
      "additional_info": `${(req.body.gateway === 'paypal') ? req.body.paymentData.id : (req.body.gateway === 'payu') ? req.body.paymentData.order_id : "NA"} - ( ${finalUserName} )`,
      "created_by": finalUserName + " (Steam Login)"
    })

    sendBuyMessageOnDiscord(req.body, finalUserName)

    res.json({
      success: true,
      data: {
        "res": result,
        "message": "All Operations Done Successfully, Refreshing page in 5 Seconds",
        "notifType": "success"
      }
    });
  } catch (error) {
    logger.error("error in afterPaymentProcess->", error);
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
      let userDisplayname = reqUser.displayName
      userDisplayname = cleanString(userDisplayname)
      let userRealName = reqUser._json.realname
      const finalUserName = userRealName + " - (" + (userDisplayname ? userDisplayname : "-_-") + ")"
      const saleType = (reqBody.buyType === 'newPurchase' || reqBody.buyType === "newPurchaseBundle") ? 1 : reqBody.buyType === 'renewPurchase' ? 2 : 0
      const serverTable = reqBody.serverData.tbl_name
      const flag = reqBody.serverData.vip_flag
      const subDays = (reqBody.serverData.vip_days / 1)
      const paymentData = reqBody.paymentData
      let paymentInsertObj

      if (reqBody.gateway === 'paypal') {
        paymentInsertObj = {
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
      } else if (reqBody.gateway === 'payu') {

        let keyString = payUConfig.merchantKey + '|' + reqBody.payuData.txnid + '|' + reqBody.payuData.amount + '|' + reqBody.payuData.productinfo + '|' + reqBody.payuData.firstname + '|' + reqBody.payuData.email + '|||||' + reqBody.payuData.udf5 + '|||||';
        let keyArray = keyString.split('|');
        let reverseKeyArray = keyArray.reverse();
        let reverseKeyString = payUConfig.merchantSalt + '|' + reqBody.payuData.status + '|' + reverseKeyArray.join('|');
        var cryp = crypto.createHash('sha512');
        cryp.update(reverseKeyString);
        var calchash = cryp.digest('hex');

        if (calchash === reqBody.payuData.hash) {
          paymentInsertObj = {
            order_id: paymentData.order_id,
            payer_id: paymentData.payer_id,
            payer_steamid: steamId,
            payer_email: paymentData.payer_email,
            payer_name: paymentData.payer_name,
            payer_surname: paymentData.payer_surname,
            product_desc: paymentData.product_desc,
            amount_paid: paymentData.amount_paid,
            amount_currency: paymentData.amount_currency,
            status: paymentData.status,
            sale_type: saleType
          }
        } else {
          return reject("Payment Tempered!, Response HASH does not matches with payment HASH therefore payment failed, Contact Support")
        }
      }

      await salesModal.insertNewSaleRecord(paymentInsertObj, reqBody.gateway)

      if (reqBody.buyType === 'newPurchase') {

        const newVipInsertObj = {
          day: epoctillExpirey(subDays),
          name: "//" + finalUserName,
          steamId: '"' + steamId + '"',
          userType: 0,
          flag: flag,
          server: serverTable.split(','),
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
          day: Math.floor(subDays * 86400),
          steamId: '"' + steamId + '"',
          server: [serverTable],
          secKey: secKey
        }

        let updateRes = await vipModel.updateVIPData(updateVipObj)
        if (updateRes) {
          for (let i = 0; i < updateVipObj.server.length; i++) {
            refreshAdminsInServer(updateVipObj.server[i]);
          }
          resolve(updateRes)
        }
      } else if (reqBody.buyType === 'newPurchaseBundle') {

        const bundleServerArray = serverTable.split(',')

        for (let i = 0; i < bundleServerArray.length; i++) {

          let checkRes = await vipModel.checkVipExists({ server: bundleServerArray[i], steamId: '"' + steamId + '"' })

          if (checkRes && checkRes.name) {
            const updateVipObj = {
              day: Math.floor(subDays * 86400),
              steamId: '"' + steamId + '"',
              server: [bundleServerArray[i]],
              secKey: secKey
            }

            let updateRes = await vipModel.updateVIPData(updateVipObj)
            if (updateRes) {
              refreshAdminsInServer(bundleServerArray[i]);
            }
          } else {
            const newVipInsertObj = {
              day: epoctillExpirey(subDays),
              name: "//" + finalUserName,
              steamId: '"' + steamId + '"',
              userType: 0,
              flag: flag,
              server: [bundleServerArray[i]],
              secKey: secKey
            }

            let insertRes = await vipModel.insertVIPData(newVipInsertObj)
            if (insertRes) {
              await refreshAdminsInServer(bundleServerArray[i]);
            }
          }
        }
        resolve(true)
      } else {
        reject("Something Went Wrong")
      }
    } catch (error) {
      logger.error("error in afterPaymentProcessFunc->", error);
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

function cleanString(input) {
  var output = "";
  for (var i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) <= 127) {
      output += input.charAt(i);
    }
  }
  return output;
}