'use strict';

const { getUUID } = require('../utils/crypto');

/**
 * Middleware to add unique request ID to each request object
 * It can be retrieved by `req.uuid`
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
const addRequestUUID = (req, res, next) => {
    const requestUUID = getUUID();
    req.uuid = requestUUID;
    next();
};

module.exports = {
    addRequestUUID
};