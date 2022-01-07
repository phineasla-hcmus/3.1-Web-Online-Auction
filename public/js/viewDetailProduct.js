document.getElementById("bidAction").onsubmit = async function (e) {
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
    if(resJson.status === "error")
        toastr.error(resJson.msg);
    if(resJson.status==="success")
        toastr.success(resJson.msg);
    if(resJson.status==="info")
        toastr.info(resJson.msg);
};

document.getElementById("likeAction").onsubmit = async function (e) {
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
  if(resJson.status === "like")
      toastr.success(resJson.msg);
  if(resJson.status==="unlike")
      toastr.success(resJson.msg);
};


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
  bidLog.removeAttribute('hidden');
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

function showUpdateField(){
  var updateField = document.getElementById('updateField');
  var updateButton = document.getElementById("updateDesButton");

  updateField.removeAttribute("hidden");
  updateButton.setAttribute("hidden","hidden");
}