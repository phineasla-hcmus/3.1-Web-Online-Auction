function actionAddRoot() {
  const buttonAddRoot = document.getElementById('addRootButton');
  const actionAddRoot = document.getElementById('addRootAction');

  buttonAddRoot.setAttribute('hidden', 'hidden');
  actionAddRoot.removeAttribute('hidden');
  console.log(buttonAddRoot);
  console.log(actionAddRoot);
}
function onClick(id) {
  if (
    document.getElementById(`parentCat${id}`).style.background === '#292560'
  ) {
    document.getElementById(`parentCat${id}`).style.background = '#fff';
  } else {
    document.getElementById(`parentCat${id}`).style.background = '#292560';
  }
  if (document.getElementById(`child${id}`).style.display === 'contents') {
    document.getElementById(`parentCat${id}`).style.background = '#fff';
    document.getElementById(`child${id}`).style.display = 'none';
  } else {
    document.getElementById(`child${id}`).style.display = 'contents';
  }
}

$(document).on('click', '.deleteChildCate', function (e) {
  const id = $(this).data('id');
  $('#childCateId').val(id);
  confirmDialog('Are you sure you want to delete this category?', function () {
    $('#deleteChildCate').submit();
  });
});

$(document).on('click', '.deleteRootCate', function (e) {
  const id = $(this).data('id');
  $('#rootCateId').val(id);
  confirmDialog(
    'Are you sure you want to delete this root category?',
    function () {
      $('#deleteRootCate').submit();
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
