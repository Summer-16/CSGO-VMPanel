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

const jwt = require('jsonwebtoken');
const config = require('../../config/config.json');
const jwtSecretKey = config.jwt.key;
const steamApi = config.steam_api_key

let checkToken = (req, res, next) => {
  let token = req.session.token || req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    jwt.verify(token, jwtSecretKey, (err, decoded) => {
      if (err) {
        return res.render('Login', { "steamLogin": (steamApi ? true : false), "error": "Unauthorized Access, If you are an Admin try logging in" })
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.render('Login', { "steamLogin": (steamApi ? true : false), "error": "Unauthorized Access, If you are an Admin try logging in" })
  }
};

function checkSteamAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

module.exports = {
  checkToken: checkToken,
  checkSteamAuthenticated: checkSteamAuthenticated
};
