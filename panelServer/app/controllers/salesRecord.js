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
const logger = require('../modules/logger')('Sales Record Controller');
const salesModal = require("../models/salesModel.js");

//-----------------------------------------------------------------------------------------------------
// 

exports.saleRecords = async (req, res) => {
  try {
    if (req.session.user_type == 1) {
      res.render('SaleRecords');
    } else {
      res.redirect('dashboard');
    }
  } catch (error) {
    logger.error("error in saleRecords-->", error);
    if (req.session.user_type == 1) {
      res.render('SaleRecords');
    } else {
      res.redirect('dashboard');
    }
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

exports.getSalesRecord = async (req, res) => {
  try {
    if (req.session.user_type == 1) {
      let result = await getSalesRecordFunc(req.body);
      res.json({
        success: true,
        data: { "res": result, "message": "Sale Records Fetched" }
      });
    } else {
      return reject("You Dont have permissions to access records")
    }
  } catch (error) {
    logger.error("error in getSalesRecord->", error);
    res.json({
      success: false,
      data: { "error": error }
    });
  }
}

const getSalesRecordFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {

      let salesRecord = await salesModal.getAllSalesRecords(reqBody)
      resolve(salesRecord)
    } catch (error) {
      logger.error("error in getSalesRecordFunc->", error);
      reject(error + ", Please try again")
    }
  });
}

exports.getSalesRecordFunc = getSalesRecordFunc;
//-----------------------------------------------------------------------------------------------------