document.getElementById('frmChangeEmail').onsubmit = async function (e) {
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
};

document.getElementById('frmChangeName').onsubmit = async function (e) {
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
};

document.getElementById('frmChangePassword').onsubmit = async function (e) {
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
};
