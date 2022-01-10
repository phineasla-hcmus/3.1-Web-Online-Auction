async function fetchAjax(e) {
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
  if (res.redirected) {
    window.location.href = res.url;
  } else {
    const resJson = await res.json();
    resJson.forEach((err) => toastr.error(err.msg));
  }
}

document.getElementById('frmChangeEmail').onsubmit = fetchAjax;
document.getElementById('frmChangeName').onsubmit = fetchAjax;
document.getElementById('frmChangeDob').onsubmit = fetchAjax;
document.getElementById('frmChangePassword').onsubmit = fetchAjax;
