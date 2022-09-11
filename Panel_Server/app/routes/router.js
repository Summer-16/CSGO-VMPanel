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

module.exports = app => {

  // Middleware Import
  const authMiddleware = require('../middleWares/auth');
  const passport = require('passport');

  // Controllers Import
  const { dashboard, getVipsDataSingleServer, getAdminsDataSingleServer } = require("../controllers/vipController.js");
  const { insertVipData, formVIP } = require("../controllers/insertVip.js");
  const { insertAdminData, formAdmin } = require("../controllers/insertAdmin.js");
  const { deleteVipData, deleteOldVipData } = require("../controllers/deleteVip.js");
  const { loginPage, authUserLogin } = require("../controllers/login.js");
  const { PanelSettings, fetchPanelSettings, updatePanelSettings } = require("../controllers/panelSettings.js")
  const { addPanelAdmin, getPanelAdminsList, deletePanelAdmin } = require("../controllers/panelAdmins.js")
  const { getPanelServersList, getPanelServerSingle, addPanelServer, deletePanelServers } = require("../controllers/panelServers.js")
  const { fetchProfileData } = require("../controllers/steamProfileDataFetch.js")
  const { myDashboard, afterPaymentProcess } = require("../controllers/userDashboard.js")
  const { saleRecords, getSalesRecord } = require("../controllers/salesRecord.js")
  const { auditRecords, getAuditRecord } = require("../controllers/auditLogs.js")
  const { initPayUPayment } = require("../controllers/payU.js")
  const { addPanelServerBundle, getPanelBundlesList, deletePanelBundle } = require("../controllers/panelServerBundles.js")
  const { sourceBans, sourceBansAddBan } = require("../controllers/sourceBans.js")

  //Public Router
  app.get("/", dashboard);
  app.get("/dashboard", dashboard);


  //Login and logout
  app.get('/login', loginPage);
  app.get('/adminLogin', loginPage);
  app.post('/adminLogin', authUserLogin);
  app.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
  });

  //route to fetch user data from steam profile
  app.post('/fetchSteamProfileData', fetchProfileData);

  //Private Router only for User (Steam Authorized)
  app.get('/auth/steam',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function (req, res) {
      res.redirect('/');
    });

  app.get('/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function (req, res) {
      res.redirect('/myDashboard');
    });

  app.get('/myDashboard', authMiddleware.checkSteamAuthenticated, myDashboard);
  app.post('/execAfterPaymentProcess', authMiddleware.checkSteamAuthenticated, afterPaymentProcess);
  app.post('/initPayUPayment', authMiddleware.checkSteamAuthenticated, initPayUPayment);
  app.get('/getPanelBundlesListUser', authMiddleware.checkSteamAuthenticated, getPanelBundlesList);


  //Private Router only for Panel Admins (Local Authorized)
  //Vip routes
  app.post("/getVipDataSingleServer", authMiddleware.checkToken, getVipsDataSingleServer);
  app.get("/manageVip", authMiddleware.checkToken, formVIP);
  app.post("/addVip", authMiddleware.checkToken, insertVipData);
  app.post("/deleteVip", authMiddleware.checkToken, deleteVipData);

  //Admin routes 
  app.post("/getAdminDataSingleServer", authMiddleware.checkToken, getAdminsDataSingleServer);
  app.get("/manageAdmin", authMiddleware.checkToken, formAdmin);
  app.post("/addAdmin", authMiddleware.checkToken, insertAdminData);

  //Panel Settings routes
  app.get('/panelSetting', authMiddleware.checkToken, PanelSettings);
  app.get('/fetchPanelSetting', authMiddleware.checkToken, fetchPanelSettings);
  app.post('/updatePanelSetting', authMiddleware.checkToken, updatePanelSettings);

  //Panel server mange routes
  app.get("/getPanelServerList", authMiddleware.checkToken, getPanelServersList);
  app.post("/getPanelServerSingle", authMiddleware.checkToken, getPanelServerSingle);
  app.post("/addPanelServer", authMiddleware.checkToken, addPanelServer);
  app.post("/deletePanelServer", authMiddleware.checkToken, deletePanelServers);

  //Panel server bundle mange routes
  app.get("/getPanelBundlesListAdmin", authMiddleware.checkToken, getPanelBundlesList);
  app.post("/addPanelServerBundle", authMiddleware.checkToken, addPanelServerBundle);
  app.post("/deletePanelBundle", authMiddleware.checkToken, deletePanelBundle);

  //Panel Admin routes
  app.get("/getPanelAdminsList", authMiddleware.checkToken, getPanelAdminsList);
  app.post("/addPanelAdmin", authMiddleware.checkToken, addPanelAdmin);
  app.post("/updatePanelAdmin", authMiddleware.checkToken, addPanelAdmin);
  app.post("/deletePanelAdmin", authMiddleware.checkToken, deletePanelAdmin);

  //Route to manually refresh data in all servers
  app.get("/performManualRefresh", authMiddleware.checkToken, deleteOldVipData);

  //Routes for Sales Records
  app.get("/salesRecord", authMiddleware.checkToken, saleRecords);
  app.post("/fetchSalesRecord", authMiddleware.checkToken, getSalesRecord);

  //Routes for Audit logs
  app.get("/auditLogs", authMiddleware.checkToken, auditRecords);
  app.post("/fetchAuditLogs", authMiddleware.checkToken, getAuditRecord);

  //Routes for sourceBans
  app.get("/sourceBans", authMiddleware.checkToken, sourceBans);
  app.post("/sourceBansAddBan", authMiddleware.checkToken, sourceBansAddBan);

  //Creator info route
  app.get('/aboutCreator', function (req, res) {
    res.render('AboutCreator');
  });
};