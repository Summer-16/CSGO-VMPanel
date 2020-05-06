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

function addNewAdminajax() {

  let serverArray = []
  $("input:checkbox[name=server_add]:checked").each(function () {
    serverArray.push($(this).val());
  });

  fetch('/addadmin', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "steamId": $('#steamId_add').val(),
      "name": $('#name_add').val(),
      "flag": $('#flag_add').val(),
      "server": serverArray,
      "submit": "insert"
    })
  })
    .then((res) => { return res.json(); })
    .then((response) => {
      showNotif(response)
      if (response.success == true) { getAdminTableListing(serverArray[0]) }
    })
    .catch();
}

function deleteAdminajax(tableName, primaryKey) {

  let htmlString = `<p>You Sure !<br>Please Confirm delete Operation for Steam Id: ${primaryKey}`

  custom_confirm(htmlString, (response) => {

    if (response == true) {
      fetch('/deletevip', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "tableName": tableName,
          "primaryKey": primaryKey
        })
      })
        .then((res) => { return res.json(); })
        .then((response) => {
          showNotif(response)
          if (response.success == true) { getAdminTableListing(tableName) }
        })
        .catch();
    }
  })
}

function getAdminTableListing(value) {
  if (value) {
    fetch('/getadmindatasingleserver', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "server": value,
      })
    })
      .then((res) => { return res.json(); })
      .then((response) => {
        let dataArray = response.data.res
        let htmlString = ""
        for (let i = 0; i < dataArray.length; i++) {
          htmlString += `<tr>
                        <td>${dataArray[i].authId ? dataArray[i].authId.replace('"', '').replace('"', '') : 'NA'}</td>
                        <td>${dataArray[i].name ? dataArray[i].name.replace("//", "") : 'NA'}</td>
                        <td>${dataArray[i].flag ? dataArray[i].flag.replace('"', '').replace('"', '') : 'NA'}</td>
                        <td> <button class="btn btn-danger" onclick="deleteAdminajax('${value}','${dataArray[i].authId.replace('"', '').replace('"', '')}')"><i class="material-icons" >delete_forever</i></button></td>
                        </tr>`
        }
        document.getElementById("manageVipTableBody").innerHTML = htmlString

        showNotif(response)
      })
      .catch();
  }
}
