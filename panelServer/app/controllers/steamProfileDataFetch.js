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

"use strict";
const request = require('request');

//-----------------------------------------------------------------------------------------------------
// 

exports.fetchProfileData = async (req, res) => {
  try {
    let result = await fetchProfileDataFunc(req.body);
    res.json({
      success: true,
      data: { "res": result, "message": "Data fetched", "notifType": "success" }
    });
  } catch (error) {
    console.log("Error fetching user data->", error)
    res.json({
      success: false,
      data: { "error": "Something went Wrong!, Error in Fetching user Data" }
    });
  }
}

const fetchProfileDataFunc = (reqBody) => {
  return new Promise(async (resolve, reject) => {
    try {

      if (reqBody.profileUrl) {
        const options = {
          'method': 'GET',
          'url': reqBody.profileUrl + '?xml=1',
          'headers': {}
        };

        request(options, function (error, response) {
          if (error) throw new Error(error);
          resolve(response.body)
        });
      } else {
        return reject("Url not provided")
      }
    } catch (error) {
      console.log("error in fetchProfileDataFunc->", error)
      reject(error + ", Please try again")
    }
  });
}

exports.fetchProfileDataFunc = fetchProfileDataFunc;
