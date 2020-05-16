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
const Rcon = require('rcon');
const panelServerModal = require("../models/panelServerModal.js");

//-----------------------------------------------------------------------------------------------------
// 

const refreshAdminsInServer = (server) => {
  return new Promise(async (resolve, reject) => {
    try {

      let serverDetails = await panelServerModal.getPanelServerDetails(server)

      if (serverDetails.server_ip && serverDetails.server_port && serverDetails.server_rcon_pass) {
        var conn = new Rcon(serverDetails.server_ip, serverDetails.server_port, serverDetails.server_rcon_pass);
        conn.on('auth', function () {
          console.log("*** Rcon Authed! ***");
          conn.send("sm_vmprefresh");
          conn.disconnect();
        }).on('response', function (str) {
          console.log("*** [RCON] Got response: " + str);
        }).on('error', function (error) {
          console.log("*** [RCON] Got error: " + error);
          return reject("Operation Done in VMPanel Database,\n There was an error while executing rcon Command for current Operation. ")
        }).on('end', function () {
          console.log("*** [RCON] Socket closed!");
          resolve(true)
        });
        conn.connect();
      } else {
        resolve(false)
      }
    } catch (error) {
      console.log("error in refreshAdminsInServer->", error)
      reject("Operation Done in VMPanel Database,\n There was an error while executing rcon Command for current Operation. ")
    }
  });
}

exports.refreshAdminsInServer = refreshAdminsInServer;
