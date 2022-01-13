
const prevBidAction = document.getElementById('prevBidAction');
if (prevBidAction) {
  prevBidAction.onclick = function (e) {
    const prevPrice = document.getElementById('prevPrice');

    const afterPrice = document.getElementById('surePrice');

    const bidForm = document.getElementById('bidAction');

    const sureBid = document.getElementById('sureBid');
    afterPrice.value = prevPrice.value;

    bidForm.setAttribute('hidden', 'hidden');
    sureBid.removeAttribute('hidden');
  };
}
const backBid = document.getElementById('backBid');
if (backBid) {
  backBid.onclick = function (e) {
    const bidForm = document.getElementById('bidAction');

    const sureBid = document.getElementById('sureBid');

    sureBid.setAttribute('hidden', 'hidden');
    bidForm.removeAttribute('hidden');
  };
}

const buyForm = document.getElementById('buyForm');
if (buyForm) {
  buyForm.onsubmit = async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch(e.target.getAttribute('action'), {
      method: e.target.getAttribute('method'),
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData),
    });
    const resJson = await res.json();
    if (resJson.status === 'error') toastr.error(resJson.msg);
    if (resJson.status === 'success') {
      toastr.success(resJson.msg);
      setTimeout(function () {
        location.reload();
      }, 1500);
    }
  };
}

const bidForm = document.getElementById('bidForm');
if (bidForm) {
  bidForm.onsubmit = async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch(e.target.getAttribute('action'), {
      method: e.target.getAttribute('method'),
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData),
    });
    const resJson = await res.json();
    if (resJson.status === 'error') toastr.error(resJson.msg);
    if (resJson.status === 'success') {
      toastr.success(resJson.msg);
      setTimeout(function () {
        location.reload();
      }, 1500);
    }
    if (resJson.status === 'info') {
      toastr.info(resJson.msg);
      setTimeout(function () {
        location.reload();
      }, 1500);
    }
  };
}

const likeForm1 = document.getElementById('like1');
if (likeForm1) {
  likeForm1.onsubmit = async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch(e.target.getAttribute('action'), {
      method: e.target.getAttribute('method'),
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData),
    });
    const resJson = await res.json();
    if (resJson.status === 'error') toastr.error(resJson.msg);
    if (resJson.status === 'success') toastr.success(resJson.msg);
    if (resJson.status === 'info') toastr.info(resJson.msg);
  };
}

const likeForm2 = document.getElementById('like2');
if (likeForm2) {
  likeForm2.onsubmit = async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch(e.target.getAttribute('action'), {
      method: e.target.getAttribute('method'),
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData),
    });
    const resJson = await res.json();
    if (resJson.status === 'error') toastr.error(resJson.msg);
    if (resJson.status === 'success') toastr.success(resJson.msg);
    if (resJson.status === 'info') toastr.info(resJson.msg);
  };
}

const likeForm3 = document.getElementById('like3');
if (likeForm3) {
  likeForm3.onsubmit = async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch(e.target.getAttribute('action'), {
      method: e.target.getAttribute('method'),
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData),
    });

    const resJson = await res.json();
    if (resJson.status === 'error') toastr.error(resJson.msg);
    if (resJson.status === 'success') toastr.success(resJson.msg);
    if (resJson.status === 'info') toastr.info(resJson.msg);
  };
}

const likeForm4 = document.getElementById('like4');
if (likeForm4) {
  likeForm4.onsubmit = async function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await fetch(e.target.getAttribute('action'), {
      method: e.target.getAttribute('method'),
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(formData),
    });
    const resJson = await res.json();
    if (resJson.status === 'error') toastr.error(resJson.msg);
    if (resJson.status === 'success') toastr.success(resJson.msg);
    if (resJson.status === 'info') toastr.info(resJson.msg);
  };
}

// $('#bidAction').submit(function (e) {
//   e.preventDefault(); // avoid to execute the actual submit of the form.
//   console.log('ENTERING');
//   var form = $(this);
//   var url = form.attr('action');
//   $.ajax({
//     type: 'POST',
//     url: url,
//     data: form.serialize(), // serializes the form's elements.
//     success: function (data) {
//       alert(data); // show response from the php script.
//     },
//   });
// });

// Jquery Dependency
// document.getElementById("number").onblur = function () {
//     this.value = parseFloat(this.value.replace(/,/g, ""))
//         .toFixed(2)
//         .toString()
//         .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     document.getElementById("display").value = this.value.replace(/,/g, "")
// }

function showbid() {
  let bidLog = document.getElementById('bidAction');
  let bidButton = document.getElementById('bidButton');
  let buyButton = document.getElementById('buynowButton');

  if(bidLog){
  bidLog.removeAttribute('hidden');}
  bidButton.setAttribute('hidden', 'hidden');
  if (buyButton) {
    buyButton.setAttribute('hidden', 'hidden');
  }
}

function showbuy() {
  let buyLog = document.getElementById('buyForm');
  let buyButton = document.getElementById('buynowButton');
  let bidButton = document.getElementById('bidButton');

  buyLog.removeAttribute('hidden');
  buyButton.setAttribute('hidden', 'hidden');
  bidButton.setAttribute('hidden', 'hidden');
}
function changeColor(id, color) {
  document.getElementById(id).style.color = color;
}

function buttonLike1() {
  let likeButton = document.getElementById('likeButton');
  let unlikeButton = document.getElementById('unlikeButton');

  if (likeButton.getAttribute('hidden')) {
    likeButton.removeAttribute('hidden');
    unlikeButton.setAttribute('hidden', 'hidden');
  } else {
    unlikeButton.removeAttribute('hidden');
    likeButton.setAttribute('hidden', 'hidden');
  }
}

function buttonLike2() {
  let likeButton = document.getElementById('likeButton');
  let unlikeButton = document.getElementById('unlikeButton');

  if (unlikeButton.getAttribute('hidden')) {
    unlikeButton.removeAttribute('hidden');
    likeButton.setAttribute('hidden', 'hidden');
  } else {
    likeButton.removeAttribute('hidden');
    unlikeButton.setAttribute('hidden', 'hidden');
  }
}

function buttonUnlike() {
  if (document.getElementById('like').style.color == 'white')
    changeColor('like', 'red');
  else changeColor('like', 'white');
}
function changeImg(pic) {
  var mainPic = document.getElementById('mainPic');
  var subPic = document.getElementById(`subPic${pic}`);
  var tmp = subPic.src;

  mainPic.src = subPic.src;
  subPic.src = tmp;
}

function showUpdateField() {
  var updateField = document.getElementById('updateField');
  var updateButton = document.getElementById('updateDesButton');

  updateField.removeAttribute('hidden');
  updateButton.setAttribute('hidden', 'hidden');
}

const imgs = document.querySelectorAll('.img-select a');
const imgBtns = [...imgs];
let imgId = 1;

imgBtns.forEach((imgItem) => {
  imgItem.addEventListener('click', (event) => {
    event.preventDefault();
    imgId = imgItem.dataset.id;
    slideImage();
  });
});

function slideImage() {
  const displayWidth = document.querySelector(
    '.img-showcase img:first-child'
  ).clientWidth;

  document.querySelector('.img-showcase').style.transform = `translateX(${
    -(imgId - 1) * displayWidth
  }px)`;
}

window.addEventListener('resize', slideImage);
