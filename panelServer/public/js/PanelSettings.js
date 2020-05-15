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

function addNewPAdminajax() {
  if (curentAdminType === 1) {

    let loader = `<div class="loading">Loading&#8230;</div>`;
    $("#divForLoader").html(loader)

    fetch('/addpaneladmin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": $('#username_padd').val(),
        "password": $('#password_padd').val(),
        "admintype": $('#admintype_padd').val(),
        "submit": "insert"
      })
    })
      .then((res) => { return res.json(); })
      .then((response) => {
        $("#divForLoader").html("")
        showNotif(response)
        if (response.success == true) { fetchPAdminajax() }
      })
      .catch(error => { showNotif({ success: false, data: { "error": error } }) });
  } else {
    showNotif({
      success: false,
      data: { "error": "You dont have Permissions to do this Action" }
    })
  }
}

function updateOldPAdminajax() {
  if (curentAdminType === 1) {

    let loader = `<div class="loading">Loading&#8230;</div>`;
    $("#divForLoader").html(loader)

    fetch('/updatepaneladmin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": $('#selected_padmin').val(),
        "newpassword": $('#password_pupdate').val(),
        "submit": "update"
      })
    })
      .then((res) => { return res.json(); })
      .then((response) => {
        $("#divForLoader").html("")
        showNotif(response)
        if (response.success == true) { fetchPAdminajax() }
      })
      .catch(error => { showNotif({ success: false, data: { "error": error } }) });
  } else {
    showNotif({
      success: false,
      data: { "error": "You dont have Permissions to do this Action" }
    })
  }
}

function deletePAdminajax() {
  if (curentAdminType === 1) {

    let loader = `<div class="loading">Loading&#8230;</div>`;
    $("#divForLoader").html(loader)

    fetch('/deletepaneladmin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": $('#selected_padmin').val(),
        "submit": "delete"
      })
    })
      .then((res) => { return res.json(); })
      .then((response) => {
        $("#divForLoader").html("")
        showNotif(response)
        if (response.success == true) { fetchPAdminajax() }
      })
      .catch(error => { showNotif({ success: false, data: { "error": error } }) });
  } else {
    showNotif({
      success: false,
      data: { "error": "You dont have Permissions to do this Action" }
    })
  }
}


function fetchPAdminajax() {
  if (curentAdminType === 1) {
    fetch('/getpaneladminslist', {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((res) => { return res.json(); })
      .then((response) => {
        if (response.success == true) {
          removeOptions(document.getElementById('selected_padmin'));
          let option = document.createElement("option");
          option.value = "";
          option.text = "Select Admin";
          option.selected = true;
          document.getElementById("selected_padmin").add(option)
          let userArray = response.data.res
          for (let i = 0; i < userArray.length; i++) {
            let option = document.createElement("option");
            option.value = userArray[i].id + ":" + userArray[i].username;
            option.text = userArray[i].username;
            document.getElementById("selected_padmin").add(option)
          }
        }
      })
      .catch(error => { showNotif({ success: false, data: { "error": error } }) });
  } else {
    showNotif({
      success: false,
      data: { "error": "You dont have Permissions to do this Action" }
    })
  }
}

function fetchPSettingajax() {

  fetch('/fetchpanelsetting', {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then((res) => { return res.json(); })
    .then((response) => {
      if (response.success == true) {
        let settingObj = response.data.res
        $("input[name=color_theme][value=" + settingObj.color_theme + "]").prop('checked', true);
        $("input[name=dash_admin_show][value=" + settingObj.dash_admin_show + "]").prop('checked', true);
        $('#webhook_url').val(settingObj.webhook_url);
        $('#community_name').val(settingObj.community_name);
        // $('#webhook_url').focus();
      }
    })
    .catch(error => { showNotif({ success: false, data: { "error": error } }) });
}

function fetchPServerListajax() {

  fetch('/getpanelserverlist', {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then((res) => { return res.json(); })
    .then((response) => {
      if (response.success == true) {

        let dataArray = response.data.res
        let htmlString = ""
        for (let i = 0; i < dataArray.length; i++) {
          htmlString += `<tr>
                        <td>${dataArray[i].server_name ? dataArray[i].server_name : 'NA'}</td>
                        <td>${dataArray[i].tbl_name ? dataArray[i].tbl_name : 'NA'}</td>
                        <td>${dataArray[i].server_ip ? dataArray[i].server_ip : 'NA'}</td>
                          <td>${dataArray[i].server_port ? dataArray[i].server_port : 'NA'}</td>
                        <td>${dataArray[i].server_rcon_pass ? dataArray[i].server_rcon_pass : 'NA'}</td>
                        <td>${dataArray[i].created_at ? dateFormatter(dataArray[i].created_at) : 'NA'}</td>
                        <td><button class="btn btn-danger" onclick="deletePServerajax('${dataArray[i].id}','${dataArray[i].tbl_name}')"><i class="material-icons" >delete_forever</i></button></td>
                        </tr>`

        }
        document.getElementById("manageServersTableBody").innerHTML = htmlString
      }
    })
    .catch(error => { showNotif({ success: false, data: { "error": error } }) });
}


function addNewPServerajax() {
  if (curentAdminType === 1) {

    let loader = `<div class="loading">Loading&#8230;</div>`;
    $("#divForLoader").html(loader)

    fetch('/addpanelserver', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "tablename": $('#servertablename_add').val(),
        "servername": $('#servername_add').val(),
        "serverip": $('#servertableIP_add').val(),
        "serverport": $('#servertablePort_add').val(),
        "serverrcon": $('#servertableRCON_add').val(),
        "submit": "insert"
      })
    })
      .then((res) => { return res.json(); })
      .then((response) => {
        $("#divForLoader").html("")
        showNotif(response)
        if (response.success == true) {
          fetchPServerListajax();
          $('#myForm_addPServer').trigger("reset");
        }
      })
      .catch(error => { showNotif({ success: false, data: { "error": error } }) });
  } else {
    showNotif({
      success: false,
      data: { "error": "You dont have Permissions to do this Action" }
    })
  }
}

function deletePServerajax(id, tablename) {
  if (curentAdminType === 1) {

    let loader = `<div class="loading">Loading&#8230;</div>`;
    $("#divForLoader").html(loader)

    fetch('/deletepanelserver', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "id": id,
        "tablename": tablename,
        "submit": "delete"
      })
    })
      .then((res) => { return res.json(); })
      .then((response) => {
        $("#divForLoader").html("")
        if (response.success == true) { fetchPServerListajax() }
        showNotif(response)
      })
      .catch(error => { showNotif({ success: false, data: { "error": error } }) });
  } else {
    showNotif({
      success: false,
      data: { "error": "You dont have Permissions to do this Action" }
    })
  }
}


function removeOptions(selectElement) {
  var i, L = selectElement.options.length - 1;
  for (i = L; i >= 0; i--) {
    selectElement.remove(i);
  }
}

function dateFormatter(date) {
  let d = new Date(date);
  let dd = d.getDate();
  let mm = d.getMonth() + 1;
  let yyyy = d.getFullYear();
  return dd + '-' + mm + '-' + yyyy;
}

$(document).ready(function () {

  fetchPAdminajax();
  fetchPSettingajax();
  fetchPServerListajax()

  // $(window).keydown(function (event) {
  //   if (event.keyCode == 13) {
  //     event.preventDefault();
  //     return false;
  //   }
  // });
});