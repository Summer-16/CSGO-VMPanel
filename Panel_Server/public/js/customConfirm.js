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