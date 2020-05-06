


function profileUrlToDataFetcher(profileUrl) {
  let proxyUrl = 'https://cors-anywhere.herokuapp.com/'
  fetch(proxyUrl + profileUrl + '?xml=1', {
    method: 'GET',
    redirect: 'follow'
  })
    .then((res) => { return res.text() })
    .then((response) => {
      let steamID64 = $(response).find("steamID64").text();
      let userName = $(response).find("steamID").html().slice(11).slice(0, -5);
      let dpURL = $(response).find("avatarMedium").html().slice(11).slice(0, -5);
      let finalSteamID = SteamIDConverter.toSteamID(steamID64);

      $('#steamId_add').val(finalSteamID);
      $('#name_add').val(userName);
      $('#steamId_update').val(finalSteamID);
      $("#display_steamId").text(finalSteamID)
      $("#display_name").text(userName)
      $("#dp_div").html(`<img src="${dpURL}" alt="Profile Picture">`);
      $("#name_add").focus();
    })
    .catch(error => console.log('error', error));

}