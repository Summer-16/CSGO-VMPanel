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