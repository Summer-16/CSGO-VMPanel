/*  Vip-Management-System-By-SUMMER_SOLDIER
 *
 *  Copyright (C) 2020 SUMMER SOLDIER
 *
 *  This file is part of Vip-Management-System-By-SUMMER_SOLDIER
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

const express = require("express");
const bodyParser = require("body-parser");
const vipModel = require("./app/models/vipModel.js");
const cron = require('node-cron');
const { sendMessageOnDiscord } = require("./app/controllers/sendMessageOnDiscord.js");
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

// parse requests of content-type - application/json
app.use(bodyParser.json({
  limit: '50mb',
  extended: true
}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));

cron.schedule('*0 */12 * * *', async () => {
  console.log("Cron running-->")
  await vipModel.deleteOldVip()
  sendMessageOnDiscord()
});


require("./app/routes/router.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3535;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// ------------ process error handling [ start  ]  ------

process.on('uncaughtException', err => {
  console.log("'uncaughtException' occurred!")
  console.log("err", err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason);
});

// ------------ process error handling [ end  ]  ------
