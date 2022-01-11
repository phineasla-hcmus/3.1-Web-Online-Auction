function buttonLikeV2(id, typehome) {
  var likebutton;
  var unlikebutton;
  if (typehome === undefined) {
    likeButton = document.getElementById(`likeButton${id}`);
    unlikeButton = document.getElementById(`unlikeButton${id}`);
  } else {
    likeButton = document.getElementById(`likeButton${id}${typehome}`);
    unlikeButton = document.getElementById(`unlikeButton${id}${typehome}`);
  }

  if (unlikeButton.getAttribute('hidden')) {
    unlikeButton.removeAttribute('hidden');
    likeButton.setAttribute('hidden', 'hidden');
  } else {
    likeButton.removeAttribute('hidden');
    unlikeButton.setAttribute('hidden', 'hidden');
  }
}
function buttonLikeV1(id, typehome) {
  var likebutton;
  var unlikebutton;

  if (typehome === undefined) {
    likeButton = document.getElementById(`likeButton${id}`);
    unlikeButton = document.getElementById(`unlikeButton${id}`);
  } else {
    likeButton = document.getElementById(`likeButton${id}${typehome}`);
    unlikeButton = document.getElementById(`unlikeButton${id}${typehome}`);
  }

  if (likeButton.getAttribute('hidden')) {
    likeButton.removeAttribute('hidden');
    unlikeButton.setAttribute('hidden', 'hidden');
  } else {
    unlikeButton.removeAttribute('hidden');
    likeButton.setAttribute('hidden', 'hidden');
  }
}

function likeAction1(proId, typeHome) {
  var likebutton1;

  if (typeHome === undefined)
    likebutton1 = document.getElementById(`likebutton1${proId}`);
  else likebutton1 = document.getElementById(`likebutton1${proId}${typeHome}`);

  if (likebutton1) {
    likebutton1.onsubmit = async function (e) {
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
}

function likeAction2(proId, typeHome) {
  var likebutton2;
  if (typeHome === undefined)
    likebutton2 = document.getElementById(`likebutton2${proId}`);
  else likebutton2 = document.getElementById(`likebutton2${proId}${typeHome}`);

  if (likebutton2) {
    likebutton2.onsubmit = async function (e) {
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
}

function likeAction3(proId, typeHome) {
  var likebutton3;
  if (typeHome === undefined)
    likebutton3 = document.getElementById(`likebutton3${proId}`);
  else likebutton3 = document.getElementById(`likebutton3${proId}${typeHome}`);

  if (likebutton3) {
    likebutton3.onsubmit = async function (e) {
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
}

function likeAction4(proId, typeHome) {
  var likebutton4;
  if (typeHome === undefined)
    likebutton4 = document.getElementById(`likebutton4${proId}`);
  else likebutton4 = document.getElementById(`likebutton4${proId}${typeHome}`);

  if (likebutton4) {
    likebutton4.onsubmit = async function (e) {
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
}

// const likebutton2 = document.getElementById('likebutton2');
// if (likebutton2) {
//     likebutton2.onsubmit = async function (e) {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const res = await fetch(e.target.getAttribute('action'), {
//       method: e.target.getAttribute('method'),
//       redirect: 'follow',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: new URLSearchParams(formData),
//     });
//     const resJson = await res.json();
//     if (resJson.status === 'error') toastr.error(resJson.msg);
//     if (resJson.status === 'success') toastr.success(resJson.msg);
//     if (resJson.status === 'info') toastr.info(resJson.msg);
//   };
// }

// const likebutton3 = document.getElementById('likebutton3');
// if (likebutton3) {
//     likebutton3.onsubmit = async function (e) {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const res = await fetch(e.target.getAttribute('action'), {
//       method: e.target.getAttribute('method'),
//       redirect: 'follow',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: new URLSearchParams(formData),
//     });
//     const resJson = await res.json();
//     if (resJson.status === 'error') toastr.error(resJson.msg);
//     if (resJson.status === 'success') toastr.success(resJson.msg);
//     if (resJson.status === 'info') toastr.info(resJson.msg);
//   };
// }

// const likebutton4 = document.getElementById('likebutton4');
// if (likebutton4) {
//     likebutton4.onsubmit = async function (e) {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const res = await fetch(e.target.getAttribute('action'), {
//       method: e.target.getAttribute('method'),
//       redirect: 'follow',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: new URLSearchParams(formData),
//     });
//     const resJson = await res.json();
//     if (resJson.status === 'error') toastr.error(resJson.msg);
//     if (resJson.status === 'success') toastr.success(resJson.msg);
//     if (resJson.status === 'info') toastr.info(resJson.msg);
//   };
// }
