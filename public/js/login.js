document.getElementsByTagName('form')[0].onsubmit = async function (e) {
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
  if (!res.ok) {
    toastr.error('Invalid username or password');
  } else if (res.redirected) {
    window.location.href = res.url;
  }
};
