$(document).on('click', '#sortByDate', function () {
  $('#sortby').val('date');
  $('#sortOption').submit();
});

$(document).on('click', '#sortByPrice', function () {
  $('#sortby').val('price');
  $('#sortOption').submit();
});

$(document).on('click', '.page-link', function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const option = urlParams.get('sortby');
  const page = $(this).text();
  $('#currentpage').val(page);
  $('#sortby').val(option);
  $('#sortOption').submit();
});
