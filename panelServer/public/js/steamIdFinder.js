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

function profileUrlToDataFetcher(profileUrl) {

  if (profileUrl) {

    let loader = `<div class="loading">Loading&#8230;</div>`;
    $("#divForLoader").html(loader)

    fetch('/fetchsteamprofiledata', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "profileUrl": profileUrl,
      })
    })
      .then((res) => { return res.json(); })
      .then((response) => {

        response = response.data.res

        $("#divForLoader").html("")

        let steamID64 = $(response).find("steamID64").text();
        let userName = $(response).find("steamID").html().slice(11).slice(0, -5);
        let dpURL = $(response).find("avatarMedium").html().slice(11).slice(0, -5);
        let finalSteamID = SteamIDConverter.toSteamID(steamID64);

        $("#divForLoader").html("")
        $('#steamId_add').val(finalSteamID);
        $('#name_add').val(userName);
        $('#steamId_update').val(finalSteamID);
        $("#display_steamId").text(finalSteamID)
        $("#display_name").text(userName)
        $("#dp_div").html(`<img src="${dpURL}" alt="Profile Picture">`);
        $("#name_add").focus();
      })
      .catch(error => {
        console.log("error -->", error)
        showNotif({ success: false, data: { "error": error } })
      });
  } else {
    showNotif({
      success: false,
      data: { "error": "Profile Url is Missing" }
    })
  }
}