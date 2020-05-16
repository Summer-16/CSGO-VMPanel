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

function addNewVIPajax() {

  let loader = `<div class="loading">Loading&#8230;</div>`;
  $("#divForLoader").html(loader)

  let flagString = '"' + ($('#immunity_vip').val() / 1) + ':'
  let serverArray = []

  $("input:checkbox[name=vip_flags]:checked").each(function () {
    flagString += $(this).val();
  });

  $("input:checkbox[name=server_add]:checked").each(function () {
    serverArray.push($(this).val());
  });

  flagString += '"';

  fetch('/addvip', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "steamId": $('#steamId_add').val(),
      "name": $('#name_add').val(),
      "day": $('#day_add').val(),
      "flag": flagString,
      "server": serverArray,
      "submit": "insert"
    })
  })
    .then((res) => { return res.json(); })
    .then((response) => {
      $("#divForLoader").html("")
      showNotif(response)
      if (response.success == true) { getVIPTableListing(serverArray[0]) }
    })
    .catch(error => { showNotif({ success: false, data: { "error": error } }) });
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

function updateOldVIPajax() {

  let loader = `<div class="loading">Loading&#8230;</div>`;
  $("#divForLoader").html(loader)

  let serverArray = []
  $("input:checkbox[name=server_update]:checked").each(function () {
    serverArray.push($(this).val());
  });

  fetch('/addvip', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "steamId": $('#steamId_update').val(),
      "day": $('#day_update').val(),
      "server": serverArray,
      "submit": "update"
    })
  })
    .then((res) => { return res.json(); })
    .then((response) => {
      $("#divForLoader").html("")
      showNotif(response)
      if (response.success == true) { getVIPTableListing(serverArray[0]) }
    })
    .catch(error => { showNotif({ success: false, data: { "error": error } }) });
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

function deleteVIPajax(tableName, primaryKey) {

  let htmlString = `<p>You Sure !<br>Please Confirm delete Operation for Steam Id: ${primaryKey}`

  custom_confirm(htmlString, (response) => {

    if (response == true) {

      let loader = `<div class="loading">Loading&#8230;</div>`;
      $("#divForLoader").html(loader)

      fetch('/deletevip', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "tableName": tableName,
          "primaryKey": primaryKey,
        })
      })
        .then((res) => { return res.json(); })
        .then((response) => {
          $("#divForLoader").html("")
          showNotif(response)
          if (response.success == true) { getVIPTableListing(tableName) }
        })
        .catch(error => { showNotif({ success: false, data: { "error": error } }) });
    }
  })
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

function getVIPTableListing(value) {
  if (value) {
    // let loader = `<div class="loading">Loading&#8230;</div>`;
    // $("#divForLoader").html(loader)

    $("#manageCardTitle").text("View and Manage VIP of " + value.toUpperCase());

    fetch('/getvipdatasingleserver', {
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
        // $("#divForLoader").html("")
        let dataArray = response.data.res
        let htmlString = ""
        for (let i = 0; i < dataArray.length; i++) {
          htmlString += `<tr>
                        <td>${dataArray[i].authId ? dataArray[i].authId.replace('"', '').replace('"', '') : 'NA'}</td>
                        <td>${dataArray[i].name ? dataArray[i].name.replace("//", "") : 'NA'}</td>
                        <td>${dataArray[i].flag ? dataArray[i].flag.replace('"', '').replace('"', '') : 'NA'}</td>
                        <td>${dataArray[i].created_at ? dateFormatter(dataArray[i].created_at) : 'NA'}</td>
                        <td>${dataArray[i].expireStamp ? EpocToDate(dataArray[i].expireStamp) : 'NA'}</td>
                        <td>${dataArray[i].expireStamp ? remainingDays(dataArray[i].expireStamp) : 'NA'}</td>
                        <td> <button class="btn btn-danger" onclick="deleteVIPajax('${value}','${dataArray[i].authId.replace('"', '').replace('"', '')}')"><i class="material-icons" >delete_forever</i></button></td>
                        </tr>`
        }
        document.getElementById("manageVipTableBody").innerHTML = htmlString

        showNotif(response)
      })
      .catch(error => { showNotif({ success: false, data: { "error": error } }) });
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

function EpocToDate(utcSeconds) {
  let d = new Date(0);
  d.setUTCSeconds(utcSeconds)
  let dd = d.getDate();
  let mm = d.getMonth() + 1;
  let yyyy = d.getFullYear();
  return dd + '-' + mm + '-' + yyyy;
}

function dateFormatter(date) {
  let d = new Date(date);
  let dd = d.getDate();
  let mm = d.getMonth() + 1;
  let yyyy = d.getFullYear();
  return dd + '-' + mm + '-' + yyyy;
}

function remainingDays(endEpoc) {
  const date1 = new Date();
  const date2 = new Date(0);
  date2.setUTCSeconds(endEpoc)
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays
}

$(document).ready(function () {
  $(window).keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});