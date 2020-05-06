// SteamIDConverter.js
// by Horse M.D.
//
// Converts Steam's various SteamID formats between each other.
// Based off of information found at https://developer.valvesoftware.com/wiki/SteamID and
// some experimentation of my own ^^.
//
// Requires peterolson's BigInteger.js library - https://github.com/peterolson/BigInteger.js
var SteamIDConverter={BASE_NUM:bigInt("76561197960265728"),REGEX_STEAMID64:/^[0-9]{17}$/,REGEX_STEAMID:/^STEAM_[0-5]:[01]:\d+$/,REGEX_STEAMID3:/^\[U:1:[0-9]+\]$/,toSteamID64:function(t){if(!t||"string"!=typeof t)return!1;if(this.isSteamID3(t))t=this.fromSteamID3(t);else if(!this.isSteamID(t))throw new TypeError("Parameter must be a SteamID (e.g. STEAM_0:1:912783)");var e=t.split(":"),i=this.BASE_NUM,r=e[2],n=e[1];return r&&n?i.plus(2*r).plus(n).toString():!1},toSteamID:function(t){if(!t||"string"!=typeof t)return!1;if(this.isSteamID3(t))return this.fromSteamID3(t);if(!this.isSteamID64(t))throw new TypeError("Parameter must be a SteamID64 (e.g. 76561190000000000)");var e=this.BASE_NUM,i=bigInt(t),r=i.mod(2).toString();return i=i.minus(r).minus(e),1>i?!1:"STEAM_0:"+r+":"+i.divide(2).toString()},toSteamID3:function(t){if(!t||"string"!=typeof t)return!1;this.isSteamID(t)||(t=this.toSteamID(t));var e=t.split(":");return"[U:1:"+(parseInt(e[1])+2*parseInt(e[2]))+"]"},fromSteamID3:function(t){var e=t.split(":"),i=e[2].substring(0,e[2].length-1);return"STEAM_0:"+i%2+":"+Math.floor(i/2)},isSteamID:function(t){return t&&"string"==typeof t?this.REGEX_STEAMID.test(t):!1},isSteamID64:function(t){return t&&"string"==typeof t?this.REGEX_STEAMID64.test(t):!1},isSteamID3:function(t){return t&&"string"==typeof t?this.REGEX_STEAMID3.test(t):!1},profileURL:function(t){return this.isSteamID64(t)||(t=this.toSteamID64(t)),"http://steamcommunity.com/profiles/"+t}};
