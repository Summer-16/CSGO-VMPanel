/* VMP-by-Summer-Soldier
*
* Copyright (C) 2022 - Shivam Parashar
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
const logger = require('../modules/logger')('My Dashboard Model');

var db = require('../db/db_bridge');
const panelServerModal = require("./panelServerModal.js");
const config = require('../config');
const salesTable = config.dbTables.salesTable
const serverTable = config.dbTables.serverTable


/**
 *   myDashboardModel Model
 */
var myDashboardModel = {

  /**
   * get User Data From All Servers
   */
  getUserDataFromAllServers: function (steamId) {
    return new Promise(async (resolve, reject) => {
      try {
        let finalResult = []
        let serverList = await panelServerModal.getPanelServersDisplayList();

        for (let i = 0; i < serverList.length; i++) {
          let query = db.queryFormat(`SELECT authId,
                                             name,
                                             expireStamp,
                                             created_at,
                                             type 
                                      FROM ${serverList[i].tbl_name} WHERE authId = ?`, [steamId]);
          let queryRes = await db.query(query);
          if (!queryRes) {
            return reject("No Data Found");
          }
          if (queryRes.length)
            finalResult.push({ "serverName": serverList[i].server_name, "data": queryRes[0] })
        }
        return resolve(finalResult);
      } catch (error) {
        logger.error("error in getUserDataFromAllServers->", error);
        reject(error)
      }
    });
  },


  /**
   * get stats for admin
   */
  getStatsForAdmin: function () {
    return new Promise(async (resolve, reject) => {
      try {
        let finalResult = {}
        let userCount = 0

        let serverList = await panelServerModal.getPanelServersDisplayList();

        for (let i = 0; i < serverList.length; i++) {
          let query = db.queryFormat(`SELECT COUNT(authId) AS userCount FROM ${serverList[i].tbl_name}`);
          let queryRes = await db.query(query, true);
          if (!queryRes) {
            return reject("No Data Found");
          }
          userCount = userCount + (queryRes.userCount / 1)
        }

        let query = db.queryFormat(`SELECT COUNT(id) AS totalServers FROM ${serverTable}`);
        let queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("No Data Found");
        }
        const totalServers = queryRes.totalServers

        query = db.queryFormat(`SELECT (SELECT COUNT(id) FROM ${salesTable} WHERE sale_type=1) as buyCount, (SELECT COUNT(id) FROM ${salesTable} WHERE sale_type=2) as renewCount `);
        queryRes = await db.query(query, true);
        if (!queryRes) {
          return reject("No Data Found");
        }
        const totalBuy = queryRes.buyCount
        const totalRenew = queryRes.renewCount

        finalResult = {
          "serverCount": totalServers,
          "userCount": userCount,
          "saleCount": totalBuy,
          "renewSaleCount": totalRenew
        }

        return resolve(finalResult);
      } catch (error) {
        logger.error("error in getStatsForAdmin->", error);
        reject(error)
      }
    });
  },


  /**
 * get server listing
 */
  getSaleServerListing: function () {
    return new Promise(async (resolve, reject) => {
      try {
        let serverArray = []

        let serverList = await panelServerModal.getPanelServersList();

        for (let i = 0; i < serverList.length; i++) {
          let query = db.queryFormat(`SELECT COUNT(authId) AS userCount FROM ${serverList[i].tbl_name} WHERE type = 0`);
          let queryRes = await db.query(query, true);
          if (!queryRes) {
            return reject("No Data Found");
          }

          if (queryRes.userCount < serverList[i].vip_slots) {
            delete serverList[i].server_rcon_pass
            serverArray.push(serverList[i])
          }
        }
        return resolve(serverArray);
      } catch (error) {
        logger.error("error in getStatsForAdmin->", error);
        reject(error)
      }
    });
  },
}

module.exports = myDashboardModel;
