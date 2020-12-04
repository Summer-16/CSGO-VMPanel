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
        const dataArray = response.children

        $("#divForLoader").html("")

        let privacyState, steamID64, userName, realName, dpURL
        for (let i = 0; i < dataArray.length; i++) {
          switch (dataArray[i].name) {
            case "privacyState":
              privacyState = dataArray[i].value
              break;
            case "steamID64":
              steamID64 = dataArray[i].value
              break;
            case "steamID":
              userName = cleanString(dataArray[i].value)
              break;
            case "realname":
              realName = dataArray[i].value
              break;
            case "avatarMedium":
              dpURL = dataArray[i].value
              break;
            default:
            // code block
          }
        }

        // let privacyState = $(response).find("privacyState").text();
        if (privacyState === "public") {

          let finalName = realName + " - (" + (userName ? userName : "-_-") + ")"
          let finalSteamID = SteamIDConverter.toSteamID(steamID64);

          $("#divForLoader").html("")
          $('#steamId_add').val(finalSteamID);
          $('#name_add').val(finalName);
          $('#name_comm').val(finalName);
          $('#steamId_update').val(finalSteamID);
          $("#display_steamId").text(finalSteamID)
          $("#display_name").text(userName)
          $("#dp_div").html(`<img src="${dpURL}" alt="Profile Picture">`);
          $("#name_add").focus();
        } else {
          showNotif({
            success: false,
            data: { "error": "Can not fetch user data Profile privacy is " + privacyState }
          })
        }
      })
      .catch(error => {
        showNotif({ success: false, data: { "error": error } })
      });
  } else {
    showNotif({
      success: false,
      data: { "error": "Profile Url is Missing" }
    })
  }
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