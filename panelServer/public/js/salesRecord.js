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

function getVIPTableListing() {

  fetch('/fetchsalesrecord', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then((res) => { return res.json(); })
    .then((response) => {
      let dataArray = response.data.res
      let htmlString = ""
      for (let i = 0; i < dataArray.length; i++) {
        htmlString += `<tr>
                        <td>${i}</td>
                        <td>${dataArray[i].order_id ? dataArray[i].order_id : 'NA'}</td>
                        <td>${dataArray[i].payer_id ? dataArray[i].payer_id : 'NA'}</td>
                        <td>${dataArray[i].payer_steamid ? dataArray[i].payer_steamid : 'NA'}</td>
                        <td>${dataArray[i].payer_name ? dataArray[i].payer_name + " " + dataArray[i].payer_surname : 'NA'}</td>
                        <td>${dataArray[i].payer_email ? dataArray[i].payer_email : 'NA'}</td>
                        <td>${dataArray[i].product_desc ? dataArray[i].product_desc : 'NA'}</td>
                        <td>${dataArray[i].amount_paid ? dataArray[i].amount_paid + dataArray[i].amount_currency : 'NA'}</td>
                        <td>${dataArray[i].status ? dataArray[i].status : 'NA'}</td>
                        <td>${dataArray[i].sale_type == 1 ? "New Buy" : dataArray[i].sale_type == 2 ? "Renew" : 'NA'}</td>
                        <td>${dataArray[i].created_on ? dateFormatter(dataArray[i].created_on) : 'NA'}</td>
                        </tr>`
      }
      document.getElementById("salesRecordBody").innerHTML = htmlString

      showNotif(response)
    })
    .catch(error => { showNotif({ success: false, data: { "error": error } }) });
}
//-----------------------------------------------------------------------------------------------------

function dateFormatter(date) {
  let d = new Date(date);
  let dd = d.getDate();
  let mm = d.getMonth() + 1;
  let yyyy = d.getFullYear();
  return dd + '-' + mm + '-' + yyyy;
}

$(document).ready(function () {

  getVIPTableListing()

  $(window).keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});