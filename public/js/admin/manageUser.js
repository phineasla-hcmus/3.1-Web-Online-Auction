function parseDate(date) {
  var d = new Date(date);
  return moment(d).format('DD/MM/YYYY HH:mm:ss');
}

function parseRating(rating) {
  return rating ? rating : '';
}

function parseUserHTML(element) {
  if (element.roleId === 3) {
    return ` <tr>
        <td>${element.userId}</td>
        <td class="hide-overflow email-content">${element.email}</td>
        <td class="hide-overflow">${element.firstname}</td>
        <td>${element.lastname}</td>
        <td class="rating-content">${parseRating(element.rating)}</td>
        <td><a href="/admin/manage/users/${
          element.userId
        }" class="btn btn-sm btn-warning text-white"><i class="fa fa-search"></i></a></td>
            <td>
                <a data-id="${
                  element.userId
                }" href="#" class="btn btn-danger downgrade">Downgrade</a>
            </td>
    </tr>`;
  } else {
    return ` <tr>
    <td>${element.userId}</td>
    <td class="hide-overflow email-content">${element.email}</td>
    <td class="hide-overflow">${element.firstname}</td>
    <td>${element.lastname}</td>
    <td class="rating-content">${parseRating(element.rating)}</td>
    <td><a href="/admin/manage/users/${
      element.userId
    }" class="btn btn-sm btn-warning text-white"><i class="fa fa-search"></i></a></td>
</tr>`;
  }
}

function parseRequestHTML(element) {
  return `<tr>
  <td>${element.userId}</td>
  <td class="hide-overflow email-content">${element.email}</td>
  <td class="hide-overflow">${element.firstname}</td>
  <td>${element.lastname}</td>
  <td class="time-content">${parseDate(element.registerTime)}</td>
  <td class="hide-overflow">${parseRating(element.rating)}</td>
  <td style="min-width: 100px;">
      <ul class="action-list">
          <li><a data-id="${
            element.userId
          }" href="#" class="btn btn-success approveRequest"><i class="fa fa-check" aria-hidden="true"></i></a></li>
          <li><a data-id="${
            element.userId
          }" href="#" class="btn btn-danger declineRequest"><i class="fa fa-times"></i></a></li>
      </ul>
  </td>
</tr>`;
}

$(document).on('click', '.approveRequest', function (e) {
  e.preventDefault();
  const id = $(this).data('id');
  $('#txtUserApprove').val(id);
  $('#frmApprove').submit();
});

$(document).on('click', '.declineRequest', function (e) {
  e.preventDefault();
  const id = $(this).data('id');
  $('#txtUserDecline').val(id);
  $('#frmDecline').submit();
});

$(document).on('click', '.downgrade', function (e) {
  e.preventDefault();
  const id = $(this).data('id');
  $('#txtUserDowngrade').val(id);
  $('#frmDowngrade').submit();
});

$(document).on('click', '#paginatorUser a', function () {
  var page = $(this).text();
  $.getJSON(`/admin/manage/usersByPaging?page=${page}`, function (data) {
    if (data.length != 0) {
      $('#list-user').text('');
      data.forEach((element) => {
        var fullhtml = parseUserHTML(element);
        $('#list-user').append(fullhtml);
      });
    }
  });
});

$(document).on('click', '#paginatorRequest a', function () {
  var page = $(this).text();
  $.getJSON(`/admin/manage/requestsByPaging?page=${page}`, function (data) {
    if (data.length != 0) {
      $('#list-request').text('');
      data.forEach((element) => {
        var fullhtml = parseRequestHTML(element);
        $('#list-request').append(fullhtml);
      });
    }
  });
});
