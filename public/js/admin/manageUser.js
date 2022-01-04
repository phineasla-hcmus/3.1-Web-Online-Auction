function parseHTML(element) {
  if (element.roleId === 3) {
    return ` <tr>
        <td>${element.userId}</td>
        <td style="max-width: 250px" class="hide-overflow">${element.email}</td>
        <td style="max-width: 200px;" class="hide-overflow">${element.firstname}</td>
        <td>${element.lastname}</td>
        <td>${element.rating}</td>
        <td><a href="/admin/manage/users/${element.userId}" class="btn btn-sm btn-warning text-white"><i class="fa fa-search"></i></a></td>
            <td style="min-width: 100px;">
                <a data-id="${element.userId}" href="#" class="btn btn-danger downgrade">Downgrade</a>
            </td>
    </tr>`;
  } else {
    return ` <tr>
    <td>${element.userId}</td>
    <td style="max-width: 250px" class="hide-overflow">${element.email}</td>
    <td style="max-width: 200px;" class="hide-overflow">${element.firstname}</td>
    <td>${element.lastname}</td>
    <td>${element.rating}</td>
    <td><a href="/admin/manage/users/${element.userId}" class="btn btn-sm btn-warning text-white"><i class="fa fa-search"></i></a></td>
</tr>`;
  }
}

$(document).on('click', '#paginator a', function () {
  var page = $(this).text();
  // const queryString = window.location.search;
  // const urlParams = new URLSearchParams(queryString);
  // const keyword = urlParams.get('keyword');
  var nPages = $('#nPages').val();
  $.getJSON(`/admin/manage/usersByPaging?page=${page}`, function (data) {
    if (data.length != 0) {
      $('#list-user').text('');
      data.forEach((element) => {
        var fullhtml = parseHTML(element);
        $('#list-user').append(fullhtml);
      });
    }
  });
  // if (value != 'all') {

  // var paginator = parsePaginator(keyword, 1, nPages);
  // $('#paginator').html(paginator);
});
