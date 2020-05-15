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
const config = require('../config/config.json')
const userModel = require("../models/userModel.js");
let jwt = require('jsonwebtoken');
const jwtSecretKey = config.jwt.key;

// -----------------------------------------------------------------------------------------

exports.loginPage = async (req, res) => {
  try {
    res.render('Login', { "error": null });
  } catch (error) {
    console.log("error in login-->", error)
    res.render('Login', { "error": error });
  }
}

// -----------------------------------------------------------------------------------------

exports.authUserLogin = async (req, res) => {
  try {

    let username = req.body.username;
    let password = req.body.password;
    // For the given username fetch user from DB
    let userData = await userModel.getuserDataByUsername(username)
    if (username && password) {
      if (username === userData.username && password === userData.password) {
        let token = jwt.sign({ username: username },
          jwtSecretKey,
          {
            expiresIn: '1h' // expires in 2 hours
          }
        );
        // return the JWT token for the future API calls
        req.session.token = token;
        req.session.username = userData.username;
        req.session.sec_key = userData.sec_key;
        req.session.user_type = userData.user_type;
        res.redirect('/managevip')
      } else {
        res.render('Login', { "error": 'Incorrect username or password' })
      }
    } else {
      res.render('Login', { "error": 'Authentication failed! Please check the request' })
    }
  } catch (error) {
    console.log("error in authUserLogin-->", error)
    res.render('Login', { "error": error })
  }
}
