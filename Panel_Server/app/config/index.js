'use strict';

const config = {};

const rawConfig = require('./config.json');
Object.assign(config, rawConfig);

module.exports = config;