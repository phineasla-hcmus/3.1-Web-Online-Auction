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
    <a href="/product?proId=${element.proId}"><img
    src="${element.secureUrl}"
    class="img-fluid"
    alt="${element.proName}"
  /></a></td>
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
                ><i class="fa fa-ban" aria-hidden="true"></i></a></li>    
        </ul>
    </td>
</tr>`;
}

function parseDisableHTML(element) {
  return ` <tr>
    <td style="min-width: 7rem;">
    <a href="/product?proId=${element.proId}"><img
    src="${element.secureUrl}"
    class="img-fluid"
    alt="${element.proName}"
  /></a></td>
    <td style="min-width: 11rem;" class="hide-overflow"
    >${element.proName}</td>
    <td style="min-width: 11rem;">${parseDate(element.postDate)}</td>
    <td style="min-width: 12rem;">${getRemainingTime(element.expiredDate)}</td>
    <td>${element.currentPrice}$</td>
    <td style="min-width: 7rem">
        <ul class="action-list">
            <li><a
            style="font-size: 15px; padding: 0.3rem 0.5rem; line-height: inherit; width: fit-content; height: fit-content"
                role="button"
                data-id="${element.proId}"
                class="btn btn-danger deleteProduct"
                ><i class="fa fa-trash" aria-hidden="true"></i></a></li>
                <li><a
                style="font-size: 15px; padding: 0.3rem 0.5rem; line-height: inherit; width: fit-content; height: fit-content"
                role="button"
                data-id="${element.proId}"
                class="btn btn-success recoveryProduct"
              ><i
                  class="fa fa-undo"
                  aria-hidden="true"
                ></i></a></li>    
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

$(document).on('click', '.deleteProduct', function (e) {
  const id = $(this).data('id');
  $('#txtDeleteProduct').val(id);
  confirmDialog('Are you sure you want to delete this product?', function () {
    $('#deleteProduct').submit();
  });
});

$(document).on('click', '.deleteAll', function (e) {
  confirmDialog(
    'Are you sure you want to delete all disabled products?',
    function () {
      $('#deleteAll').submit();
    }
  );
});

function confirmDialog(message, onConfirm) {
  var fClose = function () {
    modal.modal('hide');
  };
  var modal = $('#confirmModal');
  modal.modal('show');
  $('#confirmMessage').empty().append(message);
  $('#confirmOk').unbind().one('click', onConfirm).one('click', fClose);
  $('#confirmCancel').unbind().one('click', fClose);
}

$(document).on('click', '.recoveryProduct', function (e) {
  e.preventDefault();
  const id = $(this).data('id');
  $('#txtRecoveryProduct').val(id);
  $('#recoveryProduct').submit();
});

$(document).on('click', '#paginatorDisable a', function (e) {
  e.preventDefault();
  var page = $(this).text();
  $.getJSON(`/admin/manage/disablesByPaging?page=${page}`, function (data) {
    if (data.length != 0) {
      $('#list-disable').text('');
      data.forEach((element) => {
        var fullhtml = parseDisableHTML(element);
        $('#list-disable').append(fullhtml);
      });
    }
  });
});
