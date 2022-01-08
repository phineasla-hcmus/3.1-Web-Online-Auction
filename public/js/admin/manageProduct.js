function parseDate(date) {
  var d = new Date(date);
  return moment(d).format('DD/MM/YYYY HH:mm:ss');
}

function getRemainingTime(date) {
  let expiredDate = new Date(date);
  let dateNow = new Date();

  let seconds = Math.floor((expiredDate - dateNow) / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  hours = hours - days * 24;
  minutes = minutes - days * 24 * 60 - hours * 60;
  seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

  let result = '';
  if (days > 0) {
    result += days + ' days';
  }
  if (hours > 0) {
    result += ' ' + hours + ' hours';
  }
  if (minutes > 0) {
    result += ' ' + minutes + ' minutes';
  }
  return result;
}

function parseProductHTML(element) {
  return ` <tr>
    <td style="min-width: 7rem;">
        <img
        src="/public/images/product/${element.proId}/1.jpg"
        class="img-fluid"
        alt=""
    /></td>
    <td style="min-width: 13rem;" class="hide-overflow"
    >${element.proName}</td>
    <td style="min-width: 11rem;">${parseDate(element.postDate)}</td>
    <td style="min-width: 12rem;">${getRemainingTime(element.expiredDate)}</td>
    <td>${element.currentPrice}$</td>
    <td>
        <ul class="action-list">
            <li><a
            style="font-size: 15px; padding: 0.3rem 0.5rem; line-height: inherit; width: fit-content; height: fit-content"
                role="button"
                data-id="${element.proId}"
                class="btn btn-danger disableProduct"
                ><i class="fa fa-trash" aria-hidden="true"></i></a></li>    
        </ul>
    </td>
</tr>`;
}

$(document).on('click', '.disableProduct', function (e) {
  e.preventDefault();
  const id = $(this).data('id');
  $('#txtDisableProduct').val(id);
  $('#disableProduct').submit();
});

$(document).on('click', '#paginatorProduct a', function (e) {
  e.preventDefault();
  var page = $(this).text();
  $.getJSON(`/admin/manage/productsByPaging?page=${page}`, function (data) {
    if (data.length != 0) {
      $('#list-product').text('');
      data.forEach((element) => {
        var fullhtml = parseProductHTML(element);
        $('#list-product').append(fullhtml);
      });
    }
  });
});
