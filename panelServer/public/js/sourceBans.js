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


function addSourceBansBanajax() {

  let loader = `<div class="loading">Loading&#8230;</div>`;
  $("#divForLoader").html(loader)

  let formError = ""
  if (!$('#ban_type').val()) {
    formError = "Select Ban type"
  } else if (!$('#steamId_add').val()) {
    formError = "Steam Id Missing"
  } else if (!$('#ban_reason').val()) {
    formError = "Ban Reason Missing"
  } else if (!$('#ban_length').val()) {
    formError = "Ban length Missing"
  } else if (!$('#ban_server_add').val()) {
    formError = "Select a Server to use"
  }

  if (formError == "") {
    fetch('/sourcebansaddban', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "serverbantype": $('#ban_type').val(),
        "steamid": $('#steamId_add').val(),
        "username": $('#name_add').val(),
        "banlength": $('#ban_length').val(),
        "banreason": $('#ban_reason').val() === "OtherReason" ? $('#other_ban_reason').val() : $('#ban_reason').val(),
        "banserver": $('#ban_server_add').val(),
        "bantype": "serverBan"
      })
    })
      .then((res) => { return res.json(); })
      .then((response) => {
        $("#divForLoader").html("")
        showNotif(response)
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


function addSourceBansCommBanajax() {

  let loader = `<div class="loading">Loading&#8230;</div>`;
  $("#divForLoader").html(loader)

  let formError = ""
  if (!$('#commban_type').val()) {
    formError = "Select Comm Ban type"
  } else if (!$('#steamId_update').val()) {
    formError = "Steam Id Missing"
  } else if (!$('#commban_reason').val()) {
    formError = "Comm Ban Reason Missing"
  } else if (!$('#commban_length').val()) {
    formError = "Comm Ban length Missing"
  } else if (!$('#commban_server_add').val()) {
    formError = "Select a Server to use"
  }

  if (formError == "") {
    fetch('/sourcebansaddban', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "commbantype": $('#commban_type').val(),
        "steamid": $('#steamId_update').val(),
        "username": $('#name_comm').val(),
        "banlength": $('#commban_length').val(),
        "banreason": $('#commban_reason').val() === "OtherReason" ? $('#other_ban_reasoncomm').val() : $('#commban_reason').val(),
        "banserver": $('#commban_server_add').val(),
        "bantype": "commBan"
      })
    })
      .then((res) => { return res.json(); })
      .then((response) => {
        $("#divForLoader").html("")
        showNotif(response)
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


$(document).ready(function () {


  document.getElementById('ban_type').onchange = () => {

    let selectedBanType = $('#ban_type').val()
    if (selectedBanType === 'ipaddress') {
      let ipHtml = `<label class="bmd-label-floating">Enter IP Address</label>
                    <input id="ban_ipaddress" type="text" class="form-control" value="" required>`
      $("#ban_ip_input").html(ipHtml)
    } else {
      $("#ban_ip_input").html("")
    }

  };

  document.getElementById('ban_reason').onchange = () => {
    let selectedBanReason = $('#ban_reason').val()

    if (selectedBanReason === 'OtherReason') {

      let inputHtml = `<textarea rows="2" cols="40" maxlength="255" name="other_ban_reason" class="form-control"
                        id="other_ban_reason">Reason: </textarea>`
      $("#other_reason_input").html(inputHtml)
    } else {
      $("#other_reason_input").html("")
    }

  };

  document.getElementById('commban_reason').onchange = () => {
    let selectedBanReason = $('#commban_reason').val()

    if (selectedBanReason === 'OtherReason') {

      let inputHtml = `<textarea rows="2" cols="40" maxlength="255" name="other_ban_reasoncomm" class="form-control"
                        id="other_ban_reasoncomm">Reason: </textarea>`
      $("#other_reason_inputcomm").html(inputHtml)
    } else {
      $("#other_reason_inputcomm").html("")
    }

  };

});