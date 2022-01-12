const btnHamburger = document.querySelector('#btnHamburger');
const body = document.querySelector('body');
const header = document.querySelector('.header');
const overlay = document.querySelector('.overlay');
const fadeElems = document.querySelectorAll('.has-fade');

btnHamburger.addEventListener('click', function () {
  // Close hamburger menu
  if (header.classList.contains('open')) {
    body.classList.remove('noscroll');
    header.classList.remove('open');
    fadeElems.forEach(function (element) {
      element.classList.remove('fade-in');
      element.classList.add('fade-out');
    });
  }
  // Open hamburger menu
  else {
    body.classList.add('noscroll');
    header.classList.add('open');
    fadeElems.forEach(function (element) {
      element.classList.remove('fade-out');
      element.classList.add('fade-in');
    });
  }
});

const menu_item = document.querySelectorAll('.header__menu--item > a');
const menu_dropdown = document.querySelectorAll('.header__dropdown');
menu_item.forEach(function (element, index) {
  element.addEventListener('click', function () {
    let item = menu_dropdown[index];
    if (item.classList.contains('open')) {
      item.classList.remove('open');
    } else {
      item.classList.add('open');
    }
  });
});

$('.btnShowCategory').mouseenter(function () {
  let catName = $(this).data('name');
  $(`#${catName}-collapse`).collapse('show');
});
$('.parent-cat').mouseleave(function () {
  let catName = $(this).data('name');
  $(`#${catName}-collapse`).collapse('hide');
});
// $('.childCat').mouseleave(function () {
//   $('.childCat').collapse('hide');
// });

$(document).on('change', '#optionCategory', function (e) {
  const id = $(this).val();
  $('#chosenCat').val(id);
});

$(document).ready(function (e) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const category = urlParams.get('category');
  if (category !== '') {
    $('#chosenCat').val(category);
    $(`#optionCategory option[value=${category}]`).attr('selected', 'selected');
  }
});
