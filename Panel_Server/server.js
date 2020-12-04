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
'use strict';

const config = require('./app/config');
const scheduleConfig = config.scheduleConfig;
const logger = require('./app/modules/logger')('Server');
const express = require("express");
const cron = require('node-cron');
const session = require('express-session');
const passport = require('passport');
const SteamStrategy = require('passport-steam');
const cors = require('cors');

const requestMiddleware = require('./app/middlewares/request');
const notFoundMiddleware = require('./app/middlewares/not_found');
const vipModel = require("./app/models/vipModel.js");
const settingsModal = require("./app/models/panelSettingModal.js");
const dbBootstrap = require('./app/db/bootstrap');
const { sendMessageOnDiscord } = require("./app/controllers/sendMessageOnDiscord.js");
const { logThisActivity } = require("./app/utils/activityLogger.js");

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new SteamStrategy({
  returnURL: ((config.apacheProxy) ? ('http://' + config.hostname) : ('http://' + config.hostname + ':' + config.serverPort)) + '/auth/steam/return',
  realm: ((config.apacheProxy) ? ('http://' + config.hostname) : ('http://' + config.hostname + ':' + config.serverPort)) + '/',
  apiKey: config.steam_api_key
},
  function (identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));


const app = express();

app.set('view engine', 'ejs');

app.use(requestMiddleware.addRequestUUID);
app.use(express.static('public'));

app.use(session({
  secret: config.app.secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.options('*', cors());
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json({
  limit: '50mb',
  extended: true
}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  limit: '50mb',
  extended: true
}));

cron.schedule(`0 */${scheduleConfig.delete} * * *`, async () => {
  logger.info("****Schedule call Deleting old VIP****");
  await vipModel.deleteOldVip()
  logThisActivity({
    "activity": "Old VIP records deleted",
    "additional_info": "Old VIPs and deleted and new data is updated in servers",
    "created_by": "By Panel Cron"
  })
});

cron.schedule(`0 */${scheduleConfig.notif} * * *`, async () => {
  logger.info("****Schedule call Sending Notification on Discord****");
  sendMessageOnDiscord()
});

// middleware to make 'user' available to all templates
app.use(async function (req, res, next) {
  res.locals.panelSetting = await settingsModal.getAllSettings();
  res.locals.sessionToken = req.session.token;
  res.locals.adminName = req.session.username;
  res.locals.currentURL = req.originalUrl;
  res.locals.adminType = req.session.user_type;

  res.locals.sessionSteamId = req.session.passport ? req.session.passport.user.id : null;
  res.locals.steamName = req.session.passport ? req.session.passport.user.displayName : null;
  next();
});

require("./app/routes/router.js")(app);
app.use(notFoundMiddleware.notFound);

// Start the server after db bootstrapping
dbBootstrap().then(() => {
  // set port, listen for requests
  const PORT = process.env.PORT || config.serverPort;
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}.`);
  });
}).catch((error) => {
  logger.error("Error while doing database bootstrapping Error:", error);
  process.exit(1);
});

// ========== process error handling [ start ] ==========
process.on('uncaughtException', err => {
  logger.error("'uncaughtException' occurred! \n error:", err);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', reason.stack || reason);
});
// ========== process error handling [ end ] ==========
