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

function addNewAdminajax() {

  let loader = `<div class="loading">Loading&#8230;</div>`;
  $("#divForLoader").html(loader)

  let flagString = '"' + ($('#immunity_admin').val() / 1) + ':'
  let serverArray = []

  $("input:checkbox[name=admin_flags]:checked").each(function () {
    flagString += $(this).val();
  });

  $("input:checkbox[name=server_add]:checked").each(function () {
    serverArray.push($(this).val());
  });

  let formError = ""
  if (!$('#steamId_add').val()) {
    formError = "Steam Id can not be empty"
  } else if (!$('#name_add').val()) {
    formError = "Name can not be empty"
  } else if (!flagString.split(":")[1]) {
    formError = "Flags can not be empty"
  } else if (serverArray.length == 0) {
    formError = "Select atleast one server"
  }

  flagString += '"';

  if (formError == "") {
    fetch('/addadmin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "steamId": $('#steamId_add').val(),
        "name": $('#name_add').val(),
        "flag": flagString,
        "server": serverArray,
        "submit": "insert"
      })
    })
      .then((res) => { return res.json(); })
      .then((response) => {
        $("#divForLoader").html("")
        showNotif(response)
        if (response.success == true) { getAdminTableListing(serverArray[0]) }
      })
      .catch(error => {
        $("#divForLoader").html("")
        showNotif({ success: false, data: { "error": error } })
      });
  } else {
    $("#divForLoader").html("")
    showNotif({ success: false, data: { "error": formError } })
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

function deleteAdminajax(tableName, primaryKey) {

  let htmlString = `<p>You Sure !</p><p>Please Confirm delete Operation for Steam Id: ${primaryKey}</p>`

  custom_confirm(htmlString, (Mresponse) => {

    if (Mresponse == true) {

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
          "primaryKey": primaryKey
        })
      })
        .then((res) => { return res.json(); })
        .then((response) => {
          $("#divForLoader").html("")
          showNotif(response)
          if (response.success == true) {
            if ($("#hiddenServerTableName").val()) {
              getAdminTableListing(tableName)
            } else {
              getAdminTableListingSearch()
            }
          }
        })
        .catch(error => {
          $("#divForLoader").html("");
          showNotif({ success: false, data: { "error": error } })
        });
    }
  })
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

function getAdminTableListing(value) {

  $("#manageCardTitle").text("View and Manage Admin of " + value.toUpperCase());

  if (value) {

    // let loader = `<div class="loading">Loading&#8230;</div>`;
    // $("#divForLoader").html(loader)

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
        // $("#divForLoader").html("")
        let dataArray = response.data.res
        let htmlString = ""
        for (let i = 0; i < dataArray.length; i++) {
          htmlString += `<tr>
                        <td>${dataArray[i].authId ? dataArray[i].authId.replace('"', '').replace('"', '') : 'NA'}</td>
                        <td>${dataArray[i].name ? dataArray[i].name.replace("//", "") : 'NA'}</td>
                        <td>${dataArray[i].flag ? dataArray[i].flag.replace('"', '').replace('"', '') : 'NA'}</td>
                        <td class="text-primary">${dataArray[i].serverName ? dataArray[i].serverName : 'NA'}</td>
                        <td> <button class="btn btn-danger" onclick="deleteAdminajax('${dataArray[i].server}','${dataArray[i].authId.replace('"', '').replace('"', '')}')"><i class="material-icons" >delete_forever</i></button></td>
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

function getAdminTableListingSearch() {

  let loader = `<div class="loading">Loading&#8230;</div>`;
  $("#divForLoader").html(loader)

  let formError = ""
  if (!$('#adminSearchInput').val()) {
    formError = "You tried to make an empty search, really ?"
  }

  if (formError == "") {
    fetch('/getadmindatasingleserver', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "server": $("#hiddenServerTableName").val().split(":")[0],
        "serverName": $("#hiddenServerTableName").val().split(":")[1],
        "searchKey": $('#adminSearchInput').val()
      })
    })
      .then((res) => { return res.json(); })
      .then((response) => {
        $("#divForLoader").html("")
        let dataArray = response.data.res
        let htmlString = ""
        for (let i = 0; i < dataArray.length; i++) {
          htmlString += `<tr>
                        <td>${dataArray[i].authId ? dataArray[i].authId.replace('"', '').replace('"', '') : 'NA'}</td>
                        <td>${dataArray[i].name ? dataArray[i].name.replace("//", "") : 'NA'}</td>
                        <td>${dataArray[i].flag ? dataArray[i].flag.replace('"', '').replace('"', '') : 'NA'}</td>
                        <td class="text-primary">${dataArray[i].serverName ? dataArray[i].serverName : 'NA'}</td>
                        <td> <button class="btn btn-danger" onclick="deleteAdminajax('${dataArray[i].server}','${dataArray[i].authId.replace('"', '').replace('"', '')}')"><i class="material-icons" >delete_forever</i></button></td>
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
// Function to clear filters
function resetSearchAndTable() {
  $("#dropdownMenuButton").text("SELECT SERVER");
  $("#hiddenServerTableName").val("");
  $('#adminSearchInput').val("")
  document.getElementById("manageVipTableBody").innerHTML = ""
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

$(document).ready(function () {
  $(window).keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});