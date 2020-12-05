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
// Global variables
var record_per_page = $('#recordsPerPage').val(), current_page = 1, max_pages = 1, old_page = 0

//-----------------------------------------------------------------------------------------------------
// 

function getPanelAuditLogs(currentPage, recordPerPage) {

  let loader = `<div class="loading">Loading&#8230;</div>`;
  $("#divForLoader").html(loader)

  fetch('/fetchauditlogs', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      currentPage: currentPage,
      recordPerPage: recordPerPage
    })
  })
    .then((res) => { return res.json(); })
    .then((response) => {
      $("#divForLoader").html("")

      let dataArray = response.data.res.auditRecords
      max_pages = ((response.data.res.totalRecords / 1) > (record_per_page / 1)) ? Math.ceil((response.data.res.totalRecords / 1) / (record_per_page / 1)) : 1;
      createPagination(max_pages, currentPage);
      $(`#page_${old_page}`).removeClass("active")
      $(`#page_${current_page}`).addClass("active")

      let htmlString = ""
      for (let i = 0; i < dataArray.length; i++) {
        htmlString += `<tr>
                          <td>${dataArray[i].activity ? dataArray[i].activity : 'NA'}</td>
                          <td>${dataArray[i].additional_info ? dataArray[i].additional_info : 'NA'}</td>
                          <td>${dataArray[i].created_by ? dataArray[i].created_by : 'NA'}</td>
                          <td>${dataArray[i].created_at ? dataArray[i].created_at : 'NA'}</td>
                          </tr>`
      }
      document.getElementById("auditLogsBody").innerHTML = htmlString

    })
    .catch(error => {
      $("#divForLoader").html("")
      showNotif({ success: false, data: { "error": error } })
    });
}
//-----------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------
// pagination
function prevPage() {
  if (current_page > 1) {
    current_page--;
    setActivePage(current_page);
  }
}

function nextPage() {
  if (current_page < max_pages) {
    current_page++;
    setActivePage(current_page);
  }
}

function setActivePage(page) {
  // Validate page
  if (page / 1 < 1) {
    page = 1;
  }
  if (page / 1 > max_pages) {
    page = max_pages;
  }

  old_page = current_page
  current_page = page

  getPanelAuditLogs(page, record_per_page)
}

function recordPerPageChanged() {
  record_per_page = $('#recordsPerPage').val()
  getPanelAuditLogs(current_page, record_per_page)
}

function createPagination(maxPages, currentPage) {

  $("#paginationUL").empty();

  const prevButton = `<li class="page-item">
                      <a class="page-link" href="javascript:void(0)" onclick="prevPage()" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Previous</span>
                      </a>
                    </li>`
  const nextButton = `<li class="page-item">
                      <a class="page-link" href="javascript:void(0)" onclick="nextPage()" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>
                      </a>
                    </li>`

  $("#paginationUL").append(prevButton);
  for (let index = Math.max(1, currentPage - 2); index <= Math.min(currentPage + 2, maxPages); index++) {
    const pageLi = `<li class="page-item" id="page_${index}"><a class="page-link" href="javascript:void(0)" onclick="setActivePage(${index})">${index}</a></li>`
    $("#paginationUL").append(pageLi);
  }
  $("#paginationUL").append(nextButton);

}

function dateFormatter(date) {
  let d = new Date(date);
  let dd = d.getDate();
  let mm = d.getMonth() + 1;
  let yyyy = d.getFullYear();
  return dd + '-' + mm + '-' + yyyy;
}

$(document).ready(function () {

  setActivePage(1);

  $(window).keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});