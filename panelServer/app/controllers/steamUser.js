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

//-----------------------------------------------------------------------------------------------------
// 

exports.myDashboard = async (req, res) => {
  try {
    // let result = await myDashboardFunc(req.body);
    //console.log("req.user===>", req.user)
    res.render('UserDashboard', { "userData": req.user });
  } catch (error) {
    console.log("error in myDashboard->", error)
    res.render('UserDashboard', { "userData": null });
  }
}

// const myDashboardFunc = (reqBody) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let data = await vipModel.getallServerData()
//       resolve(data)
//     } catch (error) {
//       console.log("error in myDashboardFunc->", error)
//       reject(error)
//     }
//   });
// }

// exports.myDashboardFunc = myDashboardFunc;
//-----------------------------------------------------------------------------------------------------