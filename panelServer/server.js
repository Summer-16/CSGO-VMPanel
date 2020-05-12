/*  VMP-by-Summer-Soldier
 *
 *  Copyright (C) 2020 SUMMER SOLDIER
 *
 *  This file is part of VMP-by-Summer-Soldier
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

const config = require('./app/config/config.json')
const scheduleConfig = config.scheduleConfig;
const express = require("express");
const bodyParser = require("body-parser");
const cron = require('node-cron');
const session = require('express-session');

const vipModel = require("./app/models/vipModel.js");
const userModel = require("./app/models/userModel.js");
const settingsModal = require("./app/models/panelSettingModal.js");
const panelServerModal = require("./app/models/panelServerModal.js");
const { sendMessageOnDiscord } = require("./app/controllers/sendMessageOnDiscord.js");

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(session({
  secret: 'catINSIDEcsgoServer)(',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


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

cron.schedule(`0 */${scheduleConfig.delete} * * *`, async () => {
  console.log("****Schedule call Deleting old VIP****")
  await vipModel.deleteOldVip()
});

cron.schedule(`0 */${scheduleConfig.notif} * * *`, async () => {
  console.log("****Schedule call Sending Notification on Discord****")
  sendMessageOnDiscord()
});

//create user table if dont exists
userModel.createTheTableIfNotExists();
settingsModal.createTheTableIfNotExists();
panelServerModal.createTheTableIfNotExists();

// middleware to make 'user' available to all templates
app.use(async function (req, res, next) {
  res.locals.panelSetting = await settingsModal.getAllSettings();
  res.locals.sessionToken = req.session.token;
  res.locals.adminName = req.session.username;
  res.locals.currentURL = req.originalUrl;
  res.locals.adminType = req.session.user_type;
  next();
});

require("./app/routes/router.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || config.serverPort;
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
