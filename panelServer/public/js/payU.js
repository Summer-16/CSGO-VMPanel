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
                    <!--<div class="col-md-6">
                            <div class="form-group bmd-form-group">
                                <label class="">Enter First Name</label>
                                <input type="text" name="firstname" id="payUfirstname" class="form-control" required>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group bmd-form-group">
                                <label class="">Enter Last Name</label>
                                <input type="text" name="lastname" id="payUlastname" class="form-control" required>
                            </div>
                          </div>  -->
                          <div class="col-md-12">
                            <div class="form-group bmd-form-group">
                                <label class="">Enter Mobile No</label>
                                <input type="text" name="lastname" id="payUmobile" class="form-control" required>
                            </div>
                          </div>
                          <div class="col-md-12">
                            <div class="form-group bmd-form-group">
                                <label class="">Enter email</label>
                                <input type="text" name="email" id="payUemail" class="form-control" required>
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
          // "userFirstName": $('#payUfirstname').val(),
          // "userLasrName": $('#payUlastname').val(),
          "userEmail": $('#payUemail').val(),
          "userMobile": $('#payUmobile').val(),
        })
      })
        .then((res) => { return res.json(); })
        .then((response) => {
          $("#divForLoader").html("")
          console.log("payu response==>", response)
          launchBOLT(response.data.res, serverData, type)
        })
        .catch(error => {
          $("#divForLoader").html("")
          showNotif({ success: false, data: { "error": error } })
        });
    }
  })
}
//-----------------------------------------------------------------------------------------------------

function launchBOLT(payuObj, serverData, type) {
  bolt.launch(payuObj, {
    responseHandler: function (BOLT) {
      console.log("bolt =>", BOLT);
      console.log("bolt response=>", BOLT.response);
      console.log("bolt response txstatus=>", BOLT.response.txnStatus);

      if (BOLT.response.txnStatus === 'CANCEL') {
        showNotif({ success: false, data: { "error": "Payment Process is cancelled by user" } })
      } else if (BOLT.response.txnStatus === 'SUCCESS') {

        if (BOLT.response.hash) {
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
            "gateway": "payu"
          })

        } else {
          showNotif({ success: false, data: { "error": "Payment Tempered!, Response HASH does not matches with payment HASH therefore payment failed, Contact Support" } })
        }
      }
    },
    catchException: function (BOLT) {
      console.log("bolt =>", BOLT);
      console.log("bolt error=>", BOLT.message);
      showNotif({ success: false, data: { "error": BOLT.messag } })
    }
  });
}

// function launchPAYU(payuObj) {

//   var form = document.createElement("form");
//   form.setAttribute('id', "payuForm");
//   form.setAttribute('method', "post");
//   form.setAttribute('action', "https://sandboxsecure.payu.in/_payment");

//   let keysArray = Object.keys(payuObj)

//   for (let i = 0; i < keysArray.length; i++) {
//     let input = document.createElement("input"); //input element, Submit button
//     input.setAttribute('type', "text");
//     input.setAttribute('name', keysArray[i]);
//     input.setAttribute('value', payuObj[keysArray[i]]);
//     form.appendChild(input);
//   }
//   document.getElementsByTagName('body')[0].appendChild(form);

//   document.getElementById("payuForm").submit();

// }
