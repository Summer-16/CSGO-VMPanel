'use strict';

const config = {
  dbTables: {
    usersTable: "tbl_users",
    settingTable: "tbl_settings",
    serverTable: "tbl_servers",
    salesTable: "tbl_sales",
    auditTable: "tbl_audit_logs",
    bundleTable: "tbl_bundles",
    bundleRelTable: "tbl_rel_bundle_server",
  },
  saltRounds: 10
};

const rawConfig = require('./config.json');
Object.assign(config, rawConfig);

module.exports = config;