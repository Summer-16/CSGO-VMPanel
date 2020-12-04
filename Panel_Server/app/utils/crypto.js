'use strict';
const crypto = require("crypto");

/**
 * return n (default: 32) char unique random string
 * @param {Number} byteLength byte length 
 */
const getUUID = function (byteLength = 16) {
    return crypto.randomBytes(byteLength).toString("hex");
};

module.exports = {
    getUUID
};