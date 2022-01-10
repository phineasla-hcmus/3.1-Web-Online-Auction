document.getElementsByTagName('form')[0].onsubmit = async function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const res = await fetch(e.target.getAttribute('action'), {
    method: e.target.getAttribute('method'),
    credentials: 'include',
    redirect: 'follow',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(formData),
  });
  if (res.status === 401) {
    toastr.error('Invalid username or password');
  } else if (res.redirected) {
    window.location.replace(res.url);
  }
};
