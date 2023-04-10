/* VMP-by-Summer-Soldier
 *
 * Copyright (C) 2021 SUMMER SOLDIER - (SHIVAM PARASHAR)
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

const initRazorpayPayment = (serverData, type) => {
  const gateway = "razorPay";
  custom_confirm(paymentForm(gateway), Mresponse => {
    let loader = `<div class="loading">Loading&#8230;</div>`;
    $("#divForLoader").html(loader);
    const userDetails = {
      userFirstName: cleanString($(`#${gateway}firstname`).val()),
      userEmail: $(`#${gateway}email`).val(),
      userMobile: $(`#${gateway}mobile`).val()
    };

    if (Object.values(userDetails).some(val => !val) || !Mresponse) {
      showNotif({ success: false, data: { error: "All fields are mandatory" } });
      $("#divForLoader").html("");
      return;
    }

    fetch("/initrazorpaypayment", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        serverData: { ...serverData, ...userDetails },
        type: type,
        apiCall: true
      })
    })
      .then(res => res.json())
      .then(response => {
        $("#divForLoader").html("");
        const {
          data: { res: orderData }
        } = response;
        startRzpPayment(orderData, type).then(res => res);
      })
      .catch(error => {
        $("#divForLoader").html("");
        console.log("error==>", error);
        showNotif({ success: false, data: { error: error } });
      });
  });
};

const startRzpPayment = async (orderData, type) => {
  if (!(orderData && orderData instanceof Object)) throw new TypeError("Invalid order data received!");

  const { id: orderId, amount_due, currency, notes, keyId, serverData } = orderData;

  const rzpPaymentOptions = {
    key: keyId,
    order_id: orderId,
    amount: amount_due,
    currency: currency,
    name: "",
    description: notes.productInfo,
    notes: notes,
    prefill: {
      name: serverData.userFirstName,
      email: serverData.userEmail,
      contact: serverData.userMobile
    },
    handler: response => {
      const responseObject = {
        order_id: response.razorpay_order_id,
        payer_id: response.razorpay_payment_id,
        payer_email: serverData.userEmail,
        payer_name: serverData.userFirstName,
        payer_surname: " ",
        product_desc: notes.productInfo,
        amount_paid: amount_due / 100.0,
        amount_currency: currency,
        status: response.razorpay_payment_id && "success"
      };
      afterPaymentajax({
        serverData: serverData,
        paymentData: responseObject,
        buyType: type,
        gateway: "razorpay",
        razorpayData: response
      });
    }
  };

  const rzpInst = new Razorpay(rzpPaymentOptions);
  rzpInst.on("payment.failed", response => {
    console.log("PAYMENT ERROR =================================>", response);
  });
  rzpInst.open();

  return true;
};
