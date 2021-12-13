const btnHamburger = document.querySelector('#btnHamburger');
const body = document.querySelector('body');
const header = document.querySelector('.header');
const overlay = document.querySelector('.overlay');
const fadeElems = document.querySelectorAll('.has-fade');

btnHamburger.addEventListener('click', function () {
  console.log('open hamburger');
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
