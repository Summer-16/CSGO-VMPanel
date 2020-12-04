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
const logger = require('../modules/logger')('Sales Model');

var db = require('../db/db_bridge');
const config = require('../config');
const table = config.salestable

/**
 *   sales Model
 */
var salesModel = {

  /**
 * create table if not exists
 */
  createTheTableIfNotExists: function () {
    return new Promise(async (resolve, reject) => {
      try {

        let query = db.queryFormat(`CREATE TABLE IF NOT EXISTS ${table} (
                                      id int(10) unsigned NOT NULL AUTO_INCREMENT,
                                      payment_gateway VARCHAR(20) COLLATE utf8mb4_unicode_ci NOT NULL,
                                      order_id varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
                                      payer_id varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
                                      payer_steamid varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
                                      payer_email varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
                                      payer_name varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
                                      payer_surname varchar(150) COLLATE utf8mb4_unicode_ci NULL,
                                      product_desc varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
                                      amount_paid int(20) NOT NULL,
                                      amount_currency varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
                                      status varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
                                      sale_type tinyint(4) NOT NULL,
                                      created_on datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      PRIMARY KEY (id)
                                      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("Error in creating user table");
        }
        return resolve(true);
      } catch (error) {
        logger.error("error in createTheTableIfNotExists->", error);
        reject(error)
      }
    });
  },

  /**
   * get all the servers
   */
  insertNewSaleRecord: function (dataObj, gateway) {
    return new Promise(async (resolve, reject) => {
      try {

        // validation
        if (!dataObj.order_id) return reject("Order Id Missing");
        if (!dataObj.payer_id) return reject("Payer Id Missing");
        if (!dataObj.payer_steamid) return reject("Payer Steam Id Missing");
        if (!dataObj.payer_email) return reject("Payer Email Missing");
        if (!dataObj.payer_name) return reject("Payer Name Missing");
        if (!dataObj.payer_surname) return reject("Payer Surname Missing");
        if (!dataObj.product_desc) return reject("Product Desc Missing");
        if (!dataObj.amount_paid) return reject("Amount Paid Missing");
        if (!dataObj.amount_currency) return reject("Amount Currency Missing");
        if (!dataObj.status) return reject("Payment Status Missing");
        if (!dataObj.sale_type) return reject("Sale Type Missing");

        let paymentGate = gateway === 'paypal' ? "PayPal" : gateway === 'payu' ? "PayU" : "NA"
        let currentDateTime = new Date()

        const query = db.queryFormat(`INSERT INTO ${table} 
                                        (payment_gateway,
                                        order_id,
                                        payer_id,
                                        payer_steamid,
                                        payer_email,
                                        payer_name,
                                        payer_surname,
                                        product_desc,
                                        amount_paid,
                                        amount_currency,
                                        status,
                                        sale_type,
                                        created_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [paymentGate, dataObj.order_id, dataObj.payer_id, dataObj.payer_steamid, dataObj.payer_email, dataObj.payer_name, dataObj.payer_surname, dataObj.product_desc, dataObj.amount_paid, dataObj.amount_currency, dataObj.status, dataObj.sale_type, currentDateTime]);

        const queryRes = await db.query(query);
        if (!queryRes) {
          return reject("error in insertion");
        }
        return resolve(true);
      } catch (error) {
        logger.error("error in insertNewSaleRecord->", error);
        reject(error)
      }
    });
  },

  /**
   * get all the sale data form the table
   */
  getAllSalesRecords: function (dataObj) {
    return new Promise(async (resolve, reject) => {
      try {

        let query = db.queryFormat(`SELECT * FROM ${table} order by created_on DESC 
                                    LIMIT ${dataObj.recordPerPage} OFFSET ${(dataObj.currentPage - 1) * dataObj.recordPerPage}`);
        let queryRes = await db.query(query);
        if (!queryRes) {
          return reject("No Data Found");
        }
        let queryData = queryRes

        query = db.queryFormat(`SELECT COUNT(id) as count FROM ${table}`);
        queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("No Data Found");
        }
        let totalRecords = queryRes.count
        return resolve({
          salesRecord: queryData,
          totalRecords: totalRecords
        });
      } catch (error) {
        logger.error("error in getAllSalesRecords->", error);
        reject(error)
      }
    });
  },

}

module.exports = salesModel;