$(document).on('submit', '#frmChangeEmail', function (e) {
  e.preventDefault();
  const email = $('#email').val();
  $.getJSON(`/bidder/changeEmail?email=${email}`, function (data) {
    if (data) {
      $('#emailError').text('Already in used');
      $('#emailError').addClass('d-block');
    }
  });
});

$(document).on('submit', '#frmChangePassword', function (e) {
  e.preventDefault();
  const oldpass = $('#oldpass').val();
  const newpass = $('#newpass').val();
  const confirmpass = $('#confirmpass').val();

  $.getJSON(
    `/bidder/changePassword?old=${oldpass}&new=${newpass}&confirm=${confirmpass}`,
    function (data) {
      if (data) {
        $('#passError').text('Already in used');
        $('#passError').addClass('d-block');
      }
    }
  );
});
