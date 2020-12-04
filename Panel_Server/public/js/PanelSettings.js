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

function addNewPAdminajax() {
  if (curentAdminType === 1) {

    let loader = `<div class="loading">Loading&#8230;</div>`;
    $("#divForLoader").html(loader)

    let formError = ""
    if (!$('#username_padd').val()) {
      formError = "Admin username can not be empty"
    } else if (!$('#password_padd').val()) {
      formError = "Password can not be empty"
    } else if (!$('#admintype_padd').val()) {
      formError = "Admin Type can not be empty"
    }

    if (formError == "") {
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
        .catch(error => {
          $("#divForLoader").html("")
          showNotif({ success: false, data: { "error": error } })
        });
    } else {
      $("#divForLoader").html("")
      showNotif({ success: false, data: { "error": formError } })
    }
  } else {
    showNotif({
      success: false,
      data: { "error": "You dont have Permissions to do this Action" }
    })
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

function updateOldPAdminajax() {
  if (curentAdminType === 1) {

    let loader = `<div class="loading">Loading&#8230;</div>`;
    $("#divForLoader").html(loader)

    let formError = ""
    if (!$('#selected_padmin').val()) {
      formError = "Select atleast one Admin"
    } else if (!$('#password_pupdate').val()) {
      formError = "Password can not be empty"
    }

    if (formError == "") {
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
        .catch(error => {
          $("#divForLoader").html("")
          showNotif({ success: false, data: { "error": error } })
        });
    } else {
      $("#divForLoader").html("")
      showNotif({ success: false, data: { "error": formError } })
    }
  } else {
    showNotif({
      success: false,
      data: { "error": "You dont have Permissions to do this Action" }
    })
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

function deletePAdminajax() {

  if (curentAdminType === 1) {

    let htmlString = `<p>You Sure !</p><p>Please Confirm delete Operation for Admin: ${$('#selected_padmin').val().split(":")[1]}</p>`

    custom_confirm(htmlString, (Mresponse) => {
      if (Mresponse == true) {

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
          .catch(error => {
            $("#divForLoader").html("")
            showNotif({ success: false, data: { "error": error } })
          });
      }
    })
  } else {
    showNotif({
      success: false,
      data: { "error": "You dont have Permissions to do this Action" }
    })
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

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
            let Option = document.createElement("option");
            Option.value = userArray[i].id + ":" + userArray[i].username;
            Option.text = userArray[i].username;
            document.getElementById("selected_padmin").add(Option)
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
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

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
        if (curentAdminType === 1) {
          $("input[name=normiadmin_settings][value=" + settingObj.normiadmin_settings + "]").prop('checked', true);
          $("input[name=hiddenadmin_login][value=" + settingObj.hiddenadmin_login + "]").prop('checked', true);
          $("input[name=salenotification_discord][value=" + settingObj.salenotification_discord + "]").prop('checked', true);
          $('#webhook_url').val(settingObj.webhook_url);
          $('#community_logo_url').val(settingObj.community_logo_url);
          $('#community_info').val(settingObj.community_info);
          $('#community_website').val(settingObj.community_website);
          $('#platform_currency').val(settingObj.platform_currency);
        }
        $("input[name=color_theme][value=" + settingObj.color_theme + "]").prop('checked', true);
        $("input[name=dash_vip_show][value=" + settingObj.dash_vip_show + "]").prop('checked', true);
        $("input[name=dash_admin_show][value=" + settingObj.dash_admin_show + "]").prop('checked', true);
        $('#community_name').val(settingObj.community_name);
        // $('#webhook_url').focus();
      }
    })
    .catch(error => { showNotif({ success: false, data: { "error": error } }) });
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 
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
        let htmlString = "", htmlString2 = ""

        if (curentAdminType === 1) {
          removeOptions(document.getElementById('selected_pserver'));
          let option = document.createElement("option");
          option.value = "";
          option.text = "Select Server";
          option.selected = true;
          document.getElementById("selected_pserver").add(option)
        }

        for (let i = 0; i < dataArray.length; i++) {
          htmlString += `<tr>
                        <td>${dataArray[i].server_name ? dataArray[i].server_name : 'NA'}</td>
                        <td>${dataArray[i].tbl_name ? dataArray[i].tbl_name : 'NA'}</td>
                        <td>${dataArray[i].server_ip ? dataArray[i].server_ip : 'NA'}</td>
                        <td>${dataArray[i].server_port ? dataArray[i].server_port : 'NA'}</td>
                        <td>${dataArray[i].server_rcon_pass ? dataArray[i].server_rcon_pass : 'NA'}</td>
                        <td>${dataArray[i].vip_slots ? dataArray[i].vip_slots : 'NA'}</td>
                        <td>${dataArray[i].vip_price ? dataArray[i].vip_price + " " + dataArray[i].vip_currency : 'NA'}</td>
                        <td>${dataArray[i].vip_flag ? dataArray[i].vip_flag : 'NA'}</td>
                        <td>${dataArray[i].created_at ? dateFormatter(dataArray[i].created_at) : 'NA'}</td>
                        <td>${(curentAdminType === 1) ? `<button class="btn btn-danger" onclick="deletePServerajax('${dataArray[i].id}','${dataArray[i].tbl_name}')"><i class="material-icons" >delete_forever</i></button>` : ''}</td>
                        </tr>`

          htmlString2 += ` <div class="col-md-3">
                            <div class="form-check">
                              <label class="form-check-label">
                                <input class="form-check-input" type="checkbox" name="bundle_server_add" value="${dataArray[i].tbl_name + ":" + dataArray[i].id}">
                                ${dataArray[i].server_name}
                                <span class="form-check-sign">
                                  <span class="check"></span>
                                </span>
                              </label>
                            </div>
                          </div>`

          if (curentAdminType === 1) {
            let option = document.createElement("option");
            option.value = dataArray[i].id + ":" + dataArray[i].tbl_name + ":" + dataArray[i].server_name;
            option.text = dataArray[i].server_name + " - (" + dataArray[i].tbl_name + ")";
            document.getElementById("selected_pserver").add(option)
          }
        }
        document.getElementById("manageServersTableBody").innerHTML = htmlString
        if (curentAdminType === 1) {
          document.getElementById("bundleOfferServerListingInput").innerHTML = htmlString2
        }
      }
    })
    .catch(error => { showNotif({ success: false, data: { "error": error } }) });
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

function addNewPServerajax() {
  if (curentAdminType === 1) {

    let loader = `<div class="loading">Loading&#8230;</div>`;
    $("#divForLoader").html(loader)

    let formError = ""
    if (!$('#servertablename_add').val()) {
      formError = "Server Table name is mandatory"
    } else if (!$('#servername_add').val()) {
      formError = "Server Name is mandatory"
    }

    if (formError == "") {
      fetch('/addpanelserver', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "tablename": $('#servertablename_add').val(),
          "servername": $('#servername_add').val(),
          "serverip": $('#servertableIP_add').val() ? $('#servertableIP_add').val() : null,
          "serverport": $('#servertablePort_add').val() ? $('#servertablePort_add').val() : null,
          "serverrcon": $('#servertableRCON_add').val() ? $('#servertableRCON_add').val() : null,
          "servertotalvip": $('#servertableTotalVIPSlots_add').val() ? $('#servertableTotalVIPSlots_add').val() : null,
          "servervipprice": $('#servertableVIPPrice_add').val() ? $('#servertableVIPPrice_add').val() : null,
          "servervipcurrency": $('#servertablecurrency').val() ? $('#servertablecurrency').val() : null,
          "servervipflag": $('#servertableVIPFlag_add').val() ? $('#servertableVIPFlag_add').val() : null,
          "servervipdays": $('#servertableVIPDays_add').val() ? $('#servertableVIPDays_add').val() : null,
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
        .catch(error => {
          $("#divForLoader").html("")
          showNotif({ success: false, data: { "error": error } })
        });
    } else {
      $("#divForLoader").html("")
      showNotif({ success: false, data: { "error": formError } })
    }
  } else {
    showNotif({
      success: false,
      data: { "error": "You dont have Permissions to do this Action" }
    })
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

function updatePServerajax() {
  if (curentAdminType === 1) {

    let loader = `<div class="loading">Loading&#8230;</div>`;
    $("#divForLoader").html(loader)

    let formError = ""
    if (!$('#selected_pserver').val()) {
      formError = "Select a server to update"
    } else if (!$('#servername_update').val()) {
      formError = "Server Name can not be empty"
    }

    if (formError == "") {
      fetch('/addpanelserver', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "tablename": $('#selected_pserver').val(),
          "servername": $('#servername_update').val(),
          "serverip": $('#servertableIP_update').val(),
          "serverport": $('#servertablePort_update').val(),
          "serverrcon": $('#servertableRCON_update').val(),
          "servertotalvip": $('#servertableTotalVIPSlots_update').val(),
          "servervipprice": $('#servertableVIPPrice_update').val(),
          "servervipcurrency": $('#servertablecurrency').val(),
          "servervipflag": $('#servertableVIPFlag_update').val(),
          "servervipdays": $('#servertableVIPDays_update').val(),
          "submit": "update"
        })
      })
        .then((res) => { return res.json(); })
        .then((response) => {
          $("#divForLoader").html("")
          showNotif(response)
          if (response.success == true) {
            fetchPServerListajax();
            $('#myForm_updatePServer').trigger("reset");
          }
        })
        .catch(error => {
          $("#divForLoader").html("")
          showNotif({ success: false, data: { "error": error } })
        });
    } else {
      $("#divForLoader").html("")
      showNotif({ success: false, data: { "error": formError } })
    }
  } else {
    showNotif({
      success: false,
      data: { "error": "You dont have Permissions to do this Action" }
    })
  }
}
//-----------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------
// 

function deletePServerajax(id, tablename) {

  if (curentAdminType === 1) {

    let htmlString = `<p>You Sure !</p><p>Please Confirm delete Operation for Server: ${tablename}</p>`

    custom_confirm(htmlString, (Mresponse) => {
      if (Mresponse == true) {

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
          .catch(error => {
            $("#divForLoader").html("")
            showNotif({ success: false, data: { "error": error } })
          });
      }
    })
  } else {
    showNotif({
      success: false,
      data: { "error": "You dont have Permissions to do this Action" }
    })
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

function manuallyRefreshAllServerajax() {

  if (curentAdminType === 1) {

    let htmlString = `<p>You Sure !</p><p>Please Confirm Refresh Operation, This will delete all the expired VIPS and refresh data in All Servers</p>`

    custom_confirm(htmlString, (Mresponse) => {
      if (Mresponse == true) {

        let loader = `<div class="loading">Loading&#8230;</div>`;
        $("#divForLoader").html(loader)

        fetch('/performmanualrefresh', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
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
      }
    })
  } else {
    showNotif({
      success: false,
      data: { "error": "You dont have Permissions to do this Action" }
    })
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 

function addNewPanelServerBundle() {
  if (curentAdminType === 1) {

    let loader = `<div class="loading">Loading&#8230;</div>`;
    $("#divForLoader").html(loader)

    let serverArray = []
    $("input:checkbox[name=bundle_server_add]:checked").each(function () {
      serverArray.push($(this).val());
    });

    let formError = ""
    if (serverArray.length < 2) {
      formError = "Select atleast two servers to create a bundle"
    } else if (!$('#bundle_name_add').val()) {
      formError = "Bundle name is mandatory"
    } else if (!$('#bundle_price_add').val()) {
      formError = "Bundle Price is mandatory"
    } else if (!$('#bundle_currency_add').val()) {
      formError = "Bundle Currency is mandatory"
    } else if (!$('#bundle_subdays_add').val()) {
      formError = "Bundle Subscription days are mandatory"
    } else if (!$('#bundle_flags_add').val()) {
      formError = "Bundle VIP Flag is mandatory"
    }

    if (formError == "") {
      fetch('/addpanelserverbundle', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "bundlename": $('#bundle_name_add').val(),
          "bundleserverarray": serverArray,
          "bundleprice": $('#bundle_price_add').val(),
          "bundlecurrency": $('#bundle_currency_add').val(),
          "bundlesubdays": $('#bundle_subdays_add').val(),
          "bundlevipflag": $('#bundle_flags_add').val(),
          "submit": "insert"
        })
      })
        .then((res) => { return res.json(); })
        .then((response) => {
          $("#divForLoader").html("")
          showNotif(response)
          if (response.success == true) {
            fetchPBundleListajax();
            $('#myForm_addBundle').trigger("reset");
          }
        })
        .catch(error => {
          $("#divForLoader").html("")
          showNotif({ success: false, data: { "error": error } })
        });
    } else {
      $("#divForLoader").html("")
      showNotif({ success: false, data: { "error": formError } })
    }
  } else {
    showNotif({
      success: false,
      data: { "error": "You dont have Permissions to do this Action" }
    })
  }
}
//-----------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------
// 
function fetchPBundleListajax() {

  fetch('/getpanelbundleslist', {
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

        let htmlString = "";

        for (let i = 0; i < dataArray.length; i++) {
          let servername = dataArray[i].bundleServersData.map((data) => {
            return (data.server_name + " ( " + data.server_ip + ":" + data.server_port + " ) ")
          })
          servername = servername.join("\n")
          htmlString += `<tr>
                        <td>${dataArray[i].bundle_name ? dataArray[i].bundle_name : 'NA'}</td>
                        <td><pre class="my-pre">${servername ? servername : 'NA'}</pre></td>
                        <td>${dataArray[i].bundle_price ? dataArray[i].bundle_price + " " + dataArray[i].bundle_currency : 'NA'}</td>
                        <td>${dataArray[i].bundle_sub_days ? dataArray[i].bundle_sub_days : 'NA'}</td>
                        <td>${dataArray[i].bundle_flags ? dataArray[i].bundle_flags : 'NA'}</td>
                        <td>${dataArray[i].created_at ? dateFormatter(dataArray[i].created_at) : 'NA'}</td>
                        <td>${(curentAdminType === 1) ? `<button class="btn btn-danger" onclick="deletePBundleajax('${dataArray[i].id}','${dataArray[i].bundle_name}')"><i class="material-icons" >delete_forever</i></button>` : ''}</td>
                        </tr>`

        }
        document.getElementById("manageServerOffersTableBody").innerHTML = htmlString
      }
    })
    .catch(error => { showNotif({ success: false, data: { "error": error } }) });
}
//-----------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------
// 

function deletePBundleajax(id, bundlename) {

  if (curentAdminType === 1) {

    let htmlString = `<p>You Sure !</p><p>Please Confirm delete Operation for Bundle: ${bundlename}</p>`

    custom_confirm(htmlString, (Mresponse) => {
      if (Mresponse == true) {

        let loader = `<div class="loading">Loading&#8230;</div>`;
        $("#divForLoader").html(loader)

        fetch('/deletepanelbundle', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "id": id,
            "bundlename": bundlename,
            "submit": "delete"
          })
        })
          .then((res) => { return res.json(); })
          .then((response) => {
            $("#divForLoader").html("")
            if (response.success == true) { fetchPBundleListajax() }
            showNotif(response)
          })
          .catch(error => {
            $("#divForLoader").html("")
            showNotif({ success: false, data: { "error": error } })
          });
      }
    })
  } else {
    showNotif({
      success: false,
      data: { "error": "You dont have Permissions to do this Action" }
    })
  }
}
//-----------------------------------------------------------------------------------------------------



//-----------------------------------------------------------------------------------------------------
// 

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

  fetchPSettingajax();
  fetchPServerListajax();
  fetchPBundleListajax();

  if (curentAdminType === 1) {

    fetchPAdminajax();

    document.getElementById('selected_pserver').onchange = () => {

      let serverVal = $('#selected_pserver').val().split(":")[1]

      let loader = `<div class="loading">Loading&#8230;</div>`;
      $("#divForLoader").html(loader)

      fetch('/getpanelserversingle', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "server": serverVal
        })
      })
        .then((res) => { return res.json(); })
        .then((response) => {
          $("#divForLoader").html("")

          let serverData = response.data.res
          $('#servername_update').val(serverData.server_name)
          $('#servertableIP_update').val(serverData.server_ip)
          $('#servertablePort_update').val(serverData.server_port)
          $('#servertableRCON_update').val(serverData.server_rcon_pass)
          $('#servertableTotalVIPSlots_update').val(serverData.vip_slots)
          $('#servertableVIPPrice_update').val(serverData.vip_price)
          // $('#servertableCurrency_update').val(serverData.vip_currency)
          $('#servertableVIPFlag_update').val(serverData.vip_flag)
          $('#servertableVIPDays_update').val(serverData.vip_days)
          $('#servername_update').focus()
        })
        .catch(error => {
          $("#divForLoader").html("")
          showNotif({ success: false, data: { "error": error } })
        });


    };
  }
});