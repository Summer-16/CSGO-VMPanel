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

module.exports = app => {

  const middleware = require('../utils/middleWare/middleware.js');
  const { getVipsData, getVipsDataSingleServer, getAdminsDataSingleServer } = require("../controllers/vipController.js");
  const { insertVipData, formVIP } = require("../controllers/insertVip.js");
  const { insertAdminData, formAdmin } = require("../controllers/insertAdmin.js");
  const { deleteVipData } = require("../controllers/deleteVip.js");
  const { loginPage, authUserLogin } = require("../controllers/login.js");
  const { PanelSettings } = require("../controllers/panelSettings.js")
  const { addPanelAdmin, getPanelAdminsList, deletePanelAdmin } = require("../controllers/panelAdmins.js")

  //Public Router
  app.get("/", getVipsData);
  app.get("/dashboard", getVipsData);

  //Private Router only for Admins
  //Login and logiut
  app.get('/login', loginPage);
  app.post('/authuser', authUserLogin);
  app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
  });

  //Vip fetch
  app.post("/getvipdatasingleserver", middleware.checkToken, getVipsDataSingleServer);

  //Vip insertion or update
  app.get("/managevip", middleware.checkToken, formVIP);
  app.post("/addvip", middleware.checkToken, insertVipData);

  //Vip delete
  app.post("/deletevip", middleware.checkToken, deleteVipData);

  //admin Fetch
  app.post("/getadmindatasingleserver", middleware.checkToken, getAdminsDataSingleServer);

  //Admin insertion 
  app.get("/manageadmin", middleware.checkToken, formAdmin);
  app.post("/addadmin", middleware.checkToken, insertAdminData);

  //Panel Settings page
  app.get('/panelsetting', middleware.checkToken, PanelSettings);

  //admin Fetch
  app.get("/getpaneladminslist", middleware.checkToken, getPanelAdminsList);

  //Admin insertion 
  app.post("/addpaneladmin", middleware.checkToken, addPanelAdmin);
  app.post("/updatepaneladmin", middleware.checkToken, addPanelAdmin);
  app.post("/deletepaneladmin", middleware.checkToken, deletePanelAdmin);

  app.get('/aboutcreator', function (req, res) {
    res.render('AboutCreator');
  });

  //404
  app.get('*', function (req, res) {
    res.render('404')
  });
};