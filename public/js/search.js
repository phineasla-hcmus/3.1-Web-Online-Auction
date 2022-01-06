$(document).on('click', '#sortByDate', function () {
  $('#sortby').val('date');
  $('#sortOption').submit();
});

$(document).on('click', '#sortByPrice', function () {
  $('#sortby').val('price');
  $('#sortOption').submit();
});
