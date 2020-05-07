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
        showNotif(response)
        if (response.success == true) { fetchPAdminajax() }
      })
      .catch(error => console.log('error', error));
  }
}

function updateOldPAdminajax() {
  if (curentAdminType === 1) {
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
        showNotif(response)
        if (response.success == true) { fetchPAdminajax() }
      })
      .catch(error => console.log('error', error));
  }
}

function deletePAdminajax() {
  if (curentAdminType === 1) {
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
        showNotif(response)
        if (response.success == true) { fetchPAdminajax() }
      })
      .catch(error => console.log('error', error));
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
      .catch(error => console.log('error', error));
  }
}

function removeOptions(selectElement) {
  var i, L = selectElement.options.length - 1;
  for (i = L; i >= 0; i--) {
    selectElement.remove(i);
  }
}


$(document).ready(function () {

  fetchPAdminajax();

  $(window).keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});