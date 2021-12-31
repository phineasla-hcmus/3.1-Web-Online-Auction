function parseDate(date) {
  var d = new Date(date);
  return moment(d).format('DD/MM/YYYY HH:mm:ss');
}

function getRemainingTime(date) {
  var expiredDate = new Date(date);
  var dateNow = new Date();

  var seconds = Math.floor((expiredDate - dateNow) / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);

  hours = hours - days * 24;
  minutes = minutes - days * 24 * 60 - hours * 60;
  seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
  return days + ' days ' + hours + ' hours ' + minutes + ' minutes ';
}

function maskBidderName(bidderName) {
  const lastname = bidderName.substring(4);
  const mask = '*'.repeat(4);
  return mask + lastname;
}

function parseHTML(element, user) {
  const date = parseDate(element.expiredDate);
  const remainingTime = getRemainingTime(element.expiredDate);
  if (user) {
    return `<div class="products__item">
    <div class="products__item--content">
      <figure class="products__item--img">
        <a
          href="/product?proId=${element.proId}"
          class="popover-test"
          title="Popover title"
          data-content="Popover body content is set in this attribute."
          data-trigger="hover"
        ><img
            src="/public/images/product/${element.proId}/1.jpg"
            class="img-fluid"
            alt=""
          />
        </a>
        <div
          class="products__item--price text-primary"
          style="margin-bottom: 10px;"
        >
          <span><i class="fa fa-usd" aria-hidden="true"></i>
          ${element.currentPrice}</span>
        </div>
  
        <div class="products__item--img--preview">
          <a href="/product?proId=${element.proId}">Quick view</a>
        </div>
      </figure>
  
      <div class="products__item--wrapper">
        <div>
          <h3>
          ${element.proName}
          </h3>
          <small><i class="fa fa-calendar" aria-hidden="true"></i>
            ${date}</small>
          <p style="font-size: 0.6rem;" class="text-danger"><i
              class="fa fa-clock-o"
              aria-hidden="true"
            ></i>
            ${remainingTime}
            left</p>
          <p>
            <i class="fa fa-trophy text-warning" aria-hidden="true"></i>
            ${maskBidderName(element.bidderName)}
          </p>
        </div>
        <ul>
          <li><i class="fa fa-gavel text-danger" aria-hidden="true"></i>
          ${element.numberOfBids}
          </li>
          <li><a href="#">Bid now</a></li>
        </ul>
      </div>
    </div>
  </div>`;
  } else {
    return `<div class="products__item">
    <div class="products__item--content">
      <figure class="products__item--img">
        <a
          href="/product?proId=${element.proId}"
          class="popover-test"
          title="Popover title"
          data-content="Popover body content is set in this attribute."
          data-trigger="hover"
        ><img
            src="/public/images/product/${element.proId}/1.jpg"
            class="img-fluid"
            alt=""
          />
        </a>
        <div
          class="products__item--price text-primary"
          style="margin-bottom: 10px;"
        >
          <span><i class="fa fa-usd" aria-hidden="true"></i>
          ${element.currentPrice}</span>
        </div>
  
        <div class="products__item--img--preview">
          <a href="/product?proId=${element.proId}">Quick view</a>
        </div>
      </figure>
  
      <div class="products__item--wrapper">
        <div>
          <h3>
          ${element.proName}
          </h3>
          <small><i class="fa fa-calendar" aria-hidden="true"></i>
            ${date}</small>
          <p style="font-size: 0.6rem;" class="text-danger"><i
              class="fa fa-clock-o"
              aria-hidden="true"
            ></i>
            ${remainingTime}
            left</p>
          <p>
            <i class="fa fa-trophy text-warning" aria-hidden="true"></i>
            ${element.bidderName}
          </p>
        </div>
        <ul>
          <li><i class="fa fa-gavel text-danger" aria-hidden="true"></i>
          ${element.numberOfBids}
          </li>
        </ul>
      </div>
    </div>
  </div>`;
  }
}

function parsePaginator(keyword, page, nPages) {
  page = +page;
  nPages = +nPages;
  var fullhtml = '';
  var html = '<ul class="pagination">';
  fullhtml += html;
  if (page === 1) {
    fullhtml +=
      '<li class="page-item disabled"><a class="page-link" href="#" tabindex="-1">Previous</a></li>';
  } else {
    fullhtml +=
      '<li class="page-item"><a class="page-link" href="#" tabindex="-1">Previous</a></li>';
    // fullhtml += html.replace('pageindex', page - 1);
  }
  var start = page - 1;
  var end = page + 1;
  if (start < 1) {
    start = 1;
    end += 1;
  }
  if (end > nPages) {
    end = nPages;
    if (start > 1) start -= 1;
  }
  for (var i = start; i <= end; i++) {
    if (i === page) {
      fullhtml += `<li class="page-item active"><a class="page-link" href="javascript:;">${i}</a></li>`;
    } else {
      fullhtml += `<li class="page-item"><a class="page-link" href="/search?keyword=${keyword}&page=${i}">${i}</a></li>`;
    }
  }
  if (page === nPages) {
    fullhtml +=
      '<li class="page-item disabled"><a class="page-link" href="#">Next</a></li></ul></nav>';
  } else {
    fullhtml +=
      '<li class="page-item"><a class="page-link" href="#">Next</a></li></ul></nav>';
    // fullhtml += html.replace('pageindex', page + 1);
  }
  return fullhtml;
}

$(document).on('change', '#sort-option', function () {
  var value = $(this).val();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const keyword = urlParams.get('keyword');
  var nPages = $('#nPages').val();
  if (value != 'all') {
    $.getJSON(
      `/search/get-list-products-${value}?keyword=${keyword}`,
      function (data) {
        if (data.list.length != 0) {
          $('#products-search-result').text('');
          data.list.forEach((element) => {
            var fullhtml = parseHTML(element, data.user);
            $('#products-search-result').append(fullhtml);
          });
        }
      }
    );
  }
  var paginator = parsePaginator(keyword, 1, nPages);
  $('#paginator').html(paginator);
});
