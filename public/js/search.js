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

$(document).on('click', '.page-prev', function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const option = urlParams.get('sortby');
  const page = $('#prevpage').val();
  $('#currentpage').val(page);
  $('#sortby').val(option);
  $('#sortOption').submit();
});

$(document).on('click', '.page-next', function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const option = urlParams.get('sortby');
  const page = $('#nextpage').val();
  $('#currentpage').val(page);
  $('#sortby').val(option);
  $('#sortOption').submit();
});

$(document).ready(function (e) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const category = urlParams.get('category');
  if (category !== '') {
    $('#cat').val(category);
  }
});
