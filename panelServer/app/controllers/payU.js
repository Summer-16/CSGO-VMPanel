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
const logger = require('../modules/logger')('pay U controller');
const SteamIDConverter = require('../utils/steamIdConvertor')
const crypto = require('crypto');
const config = require('../config');
const payUConfig = config.payment_gateways.payU

//-----------------------------------------------------------------------------------------------------
// 

exports.initPayUPayment = async (req, res) => {
  try {
    const secKey = req.session.passport.user.id
    let result = await initPayUPaymentFunc(req.body, req.user, secKey);

    res.json({
      success: true,
      data: {
        "res": result,
        "message": "Payu initiated",
        "notifType": "success"
      }
    });
  } catch (error) {
    logger.error("error in add/update vip->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const initPayUPaymentFunc = (reqBody, reqUser, secKey) => {
  return new Promise(async (resolve, reject) => {
    try {

      const steamId = SteamIDConverter.toSteamID(reqUser.id);

      let productData = reqBody.serverData
      let productinfo = productData.vip_days + " days VIP for " + productData.server_name + (reqBody.type == 'newPurchase' ? " (New Buy)" : reqBody.type == 'renewPurchase' ? " (Renewal)" : "")

      let txnID = createTXNid()
      let successURL = ((config.apacheProxy) ? ('http://' + config.hostname) : ('http://' + config.hostname + ':' + config.serverPort)) + '/txnsuccesspayu'
      let errorURL = ((config.apacheProxy) ? ('http://' + config.hostname) : ('http://' + config.hostname + ':' + config.serverPort)) + '/txnerrorpayu'

      let cryp = crypto.createHash('sha512');
      let text = payUConfig.merchantKey + '|' + txnID + '|' + productData.vip_price + '|' + productinfo + '|' + reqBody.userFirstName + '|' + reqBody.userEmail + '|||||' + steamId + '||||||' + payUConfig.merchantSalt;
      cryp.update(text);
      let payUHash = cryp.digest('hex');

      let payuFormData = {
        "key": payUConfig.merchantKey,
        "txnid": txnID,
        "hash": payUHash,
        "amount": productData.vip_price,
        "firstname": reqBody.userFirstName,
        "email": reqBody.userEmail,
        "phone": reqBody.userMobile,
        "productinfo": productinfo,
        "udf5": steamId,
        "surl": successURL,
        "furl": errorURL
      }

      resolve(payuFormData)
    } catch (error) {
      logger.error("error in initPayUPaymentFunc->", error);
      reject(error + ", Please try again")
    }
  });
}

exports.initPayUPaymentFunc = initPayUPaymentFunc;
//-----------------------------------------------------------------------------------------------------

function createTXNid() {
  let txID = 'PAYUORD-'
  txID += randomString(2)
  const now = new Date()
  const secondsSinceEpoch = Math.round(now.getTime() / 1000)
  txID += secondsSinceEpoch
  return txID
}

function randomString(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}