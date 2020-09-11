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
const logger = require('../modules/logger')('refresh CGF');
const Rcon = require('rcon');
const SourceQuery = require('sourcequery');
const panelServerModal = require("../models/panelServerModal.js");

//-----------------------------------------------------------------------------------------------------
// 

const refreshAdminsInServer = (server) => {
  return new Promise(async (resolve, reject) => {
    try {

      let serverDetails = await panelServerModal.getPanelServerDetails(server)

      if (serverDetails.server_ip && serverDetails.server_port && serverDetails.server_rcon_pass) {

        let sq = new SourceQuery(1000); // 1000ms timeout
        sq.open(serverDetails.server_ip, serverDetails.server_port);
        sq.getInfo(function (err, info) {
          if (err) {
            sq.close()
            //return reject("Operation Done in VMPanel Database,\n No Rcon execution, Server is Offline ")
            return resolve(0)
          } else {
            sq.close()
            var conn = new Rcon(serverDetails.server_ip, serverDetails.server_port, serverDetails.server_rcon_pass);
            conn.on('auth', function () {
              logger.info("*** Rcon Authed! ***");
              conn.send("sm_vipRefresh");
              conn.disconnect();
            }).on('response', function (str) {
              logger.info("*** [RCON] Got response: " + str);
            }).on('error', function (error) {
              logger.error("*** [RCON] Got error: " + error);
              return reject("Operation Done in VMPanel Database,\n There was an error while executing rcon Command for current Operation. ")
            }).on('end', function () {
              logger.info("*** [RCON] Socket closed!");
              resolve(1)
            });
            conn.connect();
          }
        });
      } else {
        resolve(0)
      }
    } catch (error) {
      logger.error("error in refreshAdminsInServer->", error)
      reject("Operation Done in VMPanel Database,\n There was an error while executing rcon Command for current Operation. ")
    }
  });
}

exports.refreshAdminsInServer = refreshAdminsInServer;
