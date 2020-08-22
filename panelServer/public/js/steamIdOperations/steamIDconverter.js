// SteamIDConverter.js
// by Horse M.D.
//
// Converts Steam's various SteamID formats between each other.
// Based off of information found at https://developer.valvesoftware.com/wiki/SteamID and
// some experimentation of my own ^^.
//
// Requires peterolson's BigInteger.js library - https://github.com/peterolson/BigInteger.js

var SteamIDConverter = {

  BASE_NUM: bigInt("76561197960265728"), // "V" in the conversion algorithms

  REGEX_STEAMID64: /^[0-9]{17}$/,
  REGEX_STEAMID: /^STEAM_[0-5]:[01]:\d+$/,
  REGEX_STEAMID3: /^\[U:1:[0-9]+\]$/,

  /**
   * Generate a SteamID64 from a SteamID or SteamID3
   */
  toSteamID64: function (steamid) {
    if (!steamid || typeof steamid !== "string") {
      return false;
    }
    else if (this.isSteamID3(steamid)) {
      steamid = this.fromSteamID3(steamid);
    }
    else if (!this.isSteamID(steamid)) {
      throw new TypeError("Parameter must be a SteamID (e.g. STEAM_0:1:912783)");
    }

    var split = steamid.split(":"),
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
  toSteamID: function (steamid64) {
    if (!steamid64 || typeof steamid64 !== "string") {
      return false;
    }
    else if (this.isSteamID3(steamid64)) {
      return this.fromSteamID3(steamid64);
    }
    else if (!this.isSteamID64(steamid64)) {
      throw new TypeError("Parameter must be a SteamID64 (e.g. 76561190000000000)");
    }

    var v = this.BASE_NUM,
      w = bigInt(steamid64),
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
  toSteamID3: function (steamid) {
    if (!steamid || typeof steamid !== "string") {
      return false;
    }
    else if (!this.isSteamID(steamid)) {
      steamid = this.toSteamID(steamid);
    }

    var split = steamid.split(":");

    return "[U:1:" + (parseInt(split[1]) + parseInt(split[2]) * 2) + "]";
  },

  /**
   * Generate a SteamID from a SteamID3.
   */
  fromSteamID3: function (steamid3) {
    var split = steamid3.split(":");
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

  profileURL: function (steamid64) {
    if (!this.isSteamID64(steamid64)) {
      steamid64 = this.toSteamID64(steamid64);
    }
    return "http://steamcommunity.com/profiles/" + steamid64;
  }
};
