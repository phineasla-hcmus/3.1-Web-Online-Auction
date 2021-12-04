document.getElementsByTagName("form")[0].onsubmit = async function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const res = await fetch(e.target.getAttribute("action"), {
    method: e.target.getAttribute("method"),
    body: new URLSearchParams(formData),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  const r = await res.json();
  r.forEach((err) => toastr.error(err.msg));
};
