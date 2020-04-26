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
  const { getVipsData } = require("../controllers/vipController.js");
  const { insertVipData, form } = require("../controllers/insertVip.js");
  const { loginPage, authUserLogin } = require("../controllers/login.js");

  //Public Router
  app.get("/", getVipsData);
  app.get("/vip", getVipsData);

  //Private Router only for Admins
  //Login and logiut
  app.get('/login', loginPage);
  app.post('/authuser', authUserLogin);
  app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
  });

  //Vip insertion or update
  app.get("/form", middleware.checkToken, form);
  app.post("/addvip", middleware.checkToken, insertVipData);

  //404
  app.get('*', function (req, res) {
    res.render('404')
  });
};