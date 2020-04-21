/* Vip-Management-System-By-SUMMER_SOLDIER
*
* Copyright (C) 2020 SUMMER SOLDIER
*
* This file is part of Vip-Management-System-By-SUMMER_SOLDIER
*
* Vip-Management-System-By-SUMMER_SOLDIER is free software: you can redistribute it and/or modify it
* under the terms of the GNU General Public License as published by the Free
* Software Foundation, either version 3 of the License, or (at your option)
* any later version.
*
* Vip-Management-System-By-SUMMER_SOLDIER is distributed in the hope that it will be useful, but WITHOUT
* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
* FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License along with
* Vip-Management-System-By-SUMMER_SOLDIER. If not, see http://www.gnu.org/licenses/.
*/

"use strict";

module.exports = app => {

  const { getVipsData } = require("../controllers/vipController.js");
  const { insertVipData, form } = require("../controllers/insertVip.js");

  app.get("/", getVipsData);
  app.get("/vip", getVipsData);
  app.get("/form", form);
  app.post("/addvip", insertVipData);
  app.get('*', function (req, res) {
    res.render('404')
  });
};
