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

function addNewVIPajax() {
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
      "server": $('#server_add').val(),
      "secKey": $('#secKey_add').val(),
      "submit": "insert"
    })
  })
    .then((res) => { return res.json(); })
    .then((response) => {
      showNotif(response)
    })
    .catch();
}

function updateOldVIPajax() {
  fetch('/addvip', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "steamId": $('#steamId_update').val(),
      "day": $('#day_update').val(),
      "server": $('#server_update').val(),
      "secKey": $('#secKey_update').val(),
      "submit": "update"
    })
  })
    .then((res) => { return res.json(); })
    .then((response) => {
      showNotif(response)
    })
    .catch();
}

function deleteVIPajax(tableName, primaryKey) {

  let htmlString = `<p>Please Confirm delete dperation, Enter your Secret key and press yes</p>
                    <form>
                    <div class="form-group bmd-form-group">
                    <input id="secKey_delete" type="password" class="form-control" required>
                    </div>
                    </form>`

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
          "primaryKey": primaryKey,
          "secKey": $('#secKey_delete').val()
        })
      })
        .then((res) => { return res.json(); })
        .then((response) => {
          if (response.success == true) { getTableListing(tableName) }
          showNotif(response)
        })
        .catch();
    }
  })
}

function getTableListing(value) {
  if (value) {
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
        let dataArray = response.data.res
        let htmlString = ""
        for (let i = 0; i < dataArray.length; i++) {
          htmlString += `<tr>
                        <td>${dataArray[i].authId ? dataArray[i].authId.replace('"', '').replace('"', '') : 'NA'}</td>
                        <td>${dataArray[i].name ? dataArray[i].name.replace("//", "") : 'NA'}</td>
                        <td>${dataArray[i].flag ? dataArray[i].flag.replace('"', '').replace('"', '') : 'NA'}</td>
                        <td>${dataArray[i].expireStamp ? EpocToDate(dataArray[i].expireStamp) : 'NA'}</td>
                        <td> <button class="btn btn-danger" onclick="deleteVIPajax('${value}','${dataArray[i].authId.replace('"', '').replace('"', '')}')"><i class="material-icons" >delete_forever</i></button></td>
                        </tr>`
        }
        document.getElementById("manageVipTableBody").innerHTML = htmlString

        showNotif(response)
      })
      .catch();
  }
}

function showNotif(response) {
  if (response.success == true) {
    $.notify({
      icon: "add_alert",
      message: response.data.message
    }, {
      type: "success",
      timer: 3000,
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
      timer: 3000,
      placement: {
        from: "top",
        align: "right"
      }
    });
  }
}


function custom_confirm(message, callback) {
  //  put message into the body of modal
  //$('#userConfirmationModal-body').innerHTML = `<p>${message}</p>`;
  $('#userConfirmationModal').on('show.bs.modal', function (event) {
    //  store current modal reference
    var modal = $(this);
    //  update modal body help text
    modal.find('.modal-body').html(message);
  });
  //  show modal ringer custom confirmation
  $('#userConfirmationModal').modal('show');

  $('#userConfirmationModal button.ok').off().on('click', function () {
    // close window
    $('#userConfirmationModal').modal('hide');
    // and callback
    callback(true);
  });

  $('#userConfirmationModal button.cancel').off().on('click', function () {
    // close window
    $('#userConfirmationModal').modal('hide');
    // callback
    callback(false);
  });
}

function EpocToDate(utcSeconds) {
  let d = new Date(0);
  d.setUTCSeconds(utcSeconds)

  let dd = d.getDate();
  let mm = d.getMonth() + 1;
  let yyyy = d.getFullYear();
  return dd + '-' + mm + '-' + yyyy;
}
