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

//-----------------------------------------------------------------------------------------------------
// 

function showNotif(response) {

  let showTime = 3000;

  if (response.success == true) {
    $.notify({
      icon: "add_alert",
      message: response.data.message
    }, {
      type: response.data.notifType,
      timer: showTime,
      placement: {
        from: "top",
        align: "right"
      }
    });
  } else {
    $.notify({
      icon: "add_alert",
      message: response.data.error
    }, {
      type: "warning",
      timer: showTime,
      placement: {
        from: "top",
        align: "right"
      }
    });
  }
}