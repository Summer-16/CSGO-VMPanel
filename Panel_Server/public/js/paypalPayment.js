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

function setPayPalButton(id, serverData, type) {

  let server = serverData.server_name ? serverData.server_name : ''
  let currency = serverData.vip_currency ? serverData.vip_currency : ''
  let price = serverData.vip_price ? serverData.vip_price : ''
  let subDays = serverData.vip_days ? serverData.vip_days : ''

  if (paypalActive == true && price && currency && server) {
    paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: subDays + " days VIP for " + server + (type == 'newPurchase' ? " (New Buy)" : type == 'renewPurchase' ? " (Renewal)" : type == "newPurchaseBundle" ? " (New Buy Bundle)" : ""),
              amount: {
                currency_code: currency,
                value: price,
              },
            },
          ],
        });
      },
      onCancel: (data) => {
        showNotif({
          success: false,
          data: { "error": "Payment Failed! , Process terminated by user." }
        })
      },
      onApprove: async (data, actions) => {
        let loader = `<div class="loading">Loading&#8230;</div>`;
        $("#divForLoader").html(loader)

        showNotif({
          success: true,
          data: { "message": "Payment Sucess! , Order Id:" + data.orderID + ". Processing furture steps to activate your VIP Subscription.", "notifType": "success" }
        })

        const order = await actions.order.capture();

        afterPaymentajax({
          "serverData": serverData,
          "paymentData": order,
          "buyType": type,
          "gateway": "paypal"
        })
      },
      onError: async (error) => {

        showNotif({
          success: false,
          data: { "error": "Payment Failed! , Some Error occured try again later. Contact support if you were charged and still got error" }
        })
      },
      "style": {
        "color": "blue",
        "shape": "rect",
        "size": "responsive",
        "layout": "vertical"
      }
    })
      .render('#' + id);
  } else {
    document.getElementById(id).innerHTML = `<div class="stats text-warning">${paypalActive == true ? 'PayPal not working contact Support' : ''}</div>`
  }
}