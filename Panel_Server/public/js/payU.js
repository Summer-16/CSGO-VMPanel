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

function initPayUpayment(serverData, type) {

  let htmlString = `<p>Enter following details and proceed</p>
                    <br>
                    <form class="col-md-12">
                      <div class="row">
                          <div class="col-md-12">
                            <div class="form-group bmd-form-group">
                                <label class="">Enter Name</label>
                                <input type="text" name="firstname" id="payUfirstname" class="form-control" required>
                            </div>
                          </div>
                          <div class="col-md-12">
                            <div class="form-group bmd-form-group">
                                <label class="">Enter Mobile No</label>
                                <input type="number" name="mobile" id="payUmobile" class="form-control" required>
                            </div>
                          </div>
                          <div class="col-md-12">
                            <div class="form-group bmd-form-group">
                                <label class="">Enter email</label>
                                <input type="email" name="email" id="payUemail" class="form-control" required>
                            </div>
                          </div>
                      </div>
                    </form>`

  custom_confirm(htmlString, (Mresponse) => {

    if (Mresponse == true) {

      let loader = `<div class="loading">Loading&#8230;</div>`;
      $("#divForLoader").html(loader)

      fetch('/initpayupayment', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "serverData": serverData,
          "type": type,
          "userFirstName": cleanString($('#payUfirstname').val()),
          // "userLasrName": $('#payUlastname').val(),
          "userEmail": $('#payUemail').val(),
          "userMobile": $('#payUmobile').val(),
        })
      })
        .then((res) => { return res.json(); })
        .then((response) => {
          $("#divForLoader").html("")
          launchBOLT(response.data.res, serverData, type)
        })
        .catch(error => {
          $("#divForLoader").html("")
          console.log("error==>", error)
          showNotif({ success: false, data: { "error": error } })
        });
    }
  })
}
//-----------------------------------------------------------------------------------------------------

function launchBOLT(payuObj, serverData, type) {
  bolt.launch(payuObj, {
    responseHandler: function (BOLT) {

      if (BOLT.response.txnStatus === 'CANCEL') {
        showNotif({ success: false, data: { "error": "Payment Process is cancelled by user" } })
      } else if (BOLT.response.txnStatus === 'SUCCESS') {

        try {
          let responseObject = {
            order_id: BOLT.response.payuMoneyId,
            payer_id: BOLT.response.txnid,
            payer_email: BOLT.response.email,
            payer_name: BOLT.response.firstname,
            payer_surname: " ",
            product_desc: BOLT.response.productinfo,
            amount_paid: BOLT.response.net_amount_debit,
            amount_currency: "INR",
            status: BOLT.response.txnStatus
          }

          afterPaymentajax({
            "serverData": serverData,
            "paymentData": responseObject,
            "buyType": type,
            "gateway": "payu",
            "payuData": BOLT.response
          })

        } catch (error) {
          console.log("error==>", error)
          showNotif({ success: false, data: { "error": error } })
        }
      }
    },
    catchException: function (BOLT) {
      console.log("bolt error=>", BOLT.message);
      showNotif({ success: false, data: { "error": BOLT.message } })
    }
  });
}
//-----------------------------------------------------------------------------------------------------

function cleanString(input) {
  var output = "";
  for (var i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) <= 127) {
      output += input.charAt(i);
    }
  }
  return output;
}