/* VMP-by-Summer-Soldier
 *
 * Copyright (C) 2021 SUMMER SOLDIER - (SHIVAM PARASHAR)
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
const logger = require("../modules/logger")("RazorPay controller");
const SteamIDConverter = require("../utils/steamIdConvertor");
const config = require("../config");
const RazorPay = require("razorpay");
const { getUUID } = require("../utils/crypto");
const razorpayConfig = config.payment_gateways.razorPay;

exports.initRazorpayPayment = async (req, res) => {
  try {
    const result = await initRazorpayPaymentFunc(req.body, req.user);
    res.json({
      success: true,
      data: {
        res: result,
        message: "RazorPay initiated",
        notifType: "success"
      }
    });
  } catch (error) {
    logger.error("error in add/update vip->", error);
    res.json({
      success: false,
      data: { error: error }
    });
  }
};

const initRazorpayPaymentFunc = async (reqBody, reqUser) => {
  try {
    const steamId = SteamIDConverter.toSteamID(reqUser.id);
    return await createRzpOrder(reqBody, steamId);
  } catch (error) {
    logger.error("error in initRazorPayPaymentFunc->", error);
    throw JSON.stringify(error) + ", Please try again.";
  }
};

const createRzpOrder = async (reqBody, steamId) => {
  const { server_name, vip_price, vip_currency, vip_days } = reqBody.serverData;
  const productInfo = `${vip_days} days VIP for ${server_name} ${purchaseType(reqBody.type)}`;

  const rzpOrderOptions = {
    amount: vip_price * 100, // Convert price to smallest subunit (50 rupees -> 5000 paise).,
    currency: vip_currency,
    receipt: createReceiptNumber(),
    notes: { steamId, productInfo }
  };

  let rzpInst = new RazorPay({ key_id: razorpayConfig.keyId, key_secret: razorpayConfig.keySecret });
  return {
    ...(await rzpInst.orders.create(rzpOrderOptions)),
    keyId: razorpayConfig.keyId,
    serverData: reqBody.serverData
  };
};

const purchaseType = type => {
  if (type == "newPurchase") return "(New Buy)";
  else if (type == "renewPurchase") return "(Renewal)";
  else return "";
};

const createReceiptNumber = () => {
  return `RZPRCPT-${getUUID(6)}`;
};
