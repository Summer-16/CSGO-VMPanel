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
const logger = require('../modules/logger')('Steam Profile Data Fetch');
const Steam = require('../modules/steam');

//-----------------------------------------------------------------------------------------------------
// 

exports.fetchProfileData = async (req, res) => {
  try {
    const steam = new Steam();
    const result = await steam.getProfile(req.body.profileUrl);
    res.json({
      success: true,
      data: { "res": result, "message": "Data fetched", "notifType": "success" }
    });
  } catch (error) {
    logger.error("Error fetching user data->", error);
    res.json({
      success: false,
      data: { "error": "Something went Wrong!, Error in Fetching user Data" }
    });
  }
};