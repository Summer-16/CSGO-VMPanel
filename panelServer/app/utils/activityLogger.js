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

'use strict';
const logger = require('../modules/logger')('Activity Logger');
const auditModal = require("../models/auditLogsModel.js");

//-----------------------------------------------------------------------------------------------------
// 

const logThisActivity = (activityObject) => {
  try {

    // validation
    if (!activityObject.activity) return reject("Activity can't be null");
    if (!activityObject.created_by) return reject("Created by can't be null");

    auditModal.insertNewAuditRecord(activityObject)
  } catch (error) {
    logger.error("error in activity logger->", error);
  }
}

exports.logThisActivity = logThisActivity;
