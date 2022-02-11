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


const bigInt = require("big-integer");

var SteamIDConverter = {

  BASE_NUM: bigInt("76561197960265728"), // "V" in the conversion algorithms

  REGEX_STEAMID64: /^[0-9]{17}$/,
  REGEX_STEAMID: /^STEAM_[0-5]:[01]:\d+$/,
  REGEX_STEAMID3: /^\[U:1:[0-9]+\]$/,

  /**
   * Generate a SteamID64 from a SteamID or SteamID3
   */
  toSteamID64: function (steamId) {
    if (!steamId || typeof steamId !== "string") {
      return false;
    }
    else if (this.isSteamID3(steamId)) {
      steamId = this.fromSteamID3(steamId);
    }
    else if (!this.isSteamID(steamId)) {
      throw new TypeError("Parameter must be a SteamID (e.g. STEAM_0:1:912783)");
    }

    var split = steamId.split(":"),
      v = this.BASE_NUM,
      z = split[2],
      y = split[1];

    if (z && y) {
      return v.plus(z * 2).plus(y).toString();
    }
    return false;
  },

  /**
   * Generate a SteamID from a SteamID64 or SteamID3
   */
  toSteamID: function (steamId64) {
    if (!steamId64 || typeof steamId64 !== "string") {
      return false;
    }
    else if (this.isSteamID3(steamId64)) {
      return this.fromSteamID3(steamId64);
    }
    else if (!this.isSteamID64(steamId64)) {
      throw new TypeError("Parameter must be a SteamID64 (e.g. 76561190000000000)");
    }

    var v = this.BASE_NUM,
      w = bigInt(steamId64),
      y = w.mod(2).toString();

    w = w.minus(y).minus(v);

    if (w < 1) {
      return false;
    }
    return "STEAM_1:" + y + ":" + w.divide(2).toString();
  },

  /**
   * Generate a SteamID3 from a SteamID or SteamID64
   */
  toSteamID3: function (steamId) {
    if (!steamId || typeof steamId !== "string") {
      return false;
    }
    else if (!this.isSteamID(steamId)) {
      steamId = this.toSteamID(steamId);
    }

    var split = steamId.split(":");

    return "[U:1:" + (parseInt(split[1]) + parseInt(split[2]) * 2) + "]";
  },

  /**
   * Generate a SteamID from a SteamID3.
   */
  fromSteamID3: function (steamId3) {
    var split = steamId3.split(":");
    var last = split[2].substring(0, split[2].length - 1);

    return "STEAM_0:" + (last % 2) + ":" + Math.floor(last / 2);
  },

  // ------------------------------------------------------------------------------

  isSteamID: function (id) {
    if (!id || typeof id !== "string") {
      return false;
    }
    return this.REGEX_STEAMID.test(id);
  },

  isSteamID64: function (id) {
    if (!id || typeof id !== "string") {
      return false;
    }
    return this.REGEX_STEAMID64.test(id);
  },

  isSteamID3: function (id) {
    if (!id || typeof id !== "string") {
      return false;
    }
    return this.REGEX_STEAMID3.test(id);
  },

  // ------------------------------------------------------------------------------

  profileURL: function (steamId64) {
    if (!this.isSteamID64(steamId64)) {
      steamId64 = this.toSteamID64(steamId64);
    }
    return "http://steamcommunity.com/profiles/" + steamId64;
  }
};


module.exports = SteamIDConverter;