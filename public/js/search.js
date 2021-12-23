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

function parseHTML(element) {
  const date = parseDate(element.expiredDate);
  const remainingTime = getRemainingTime(element.expiredDate);
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

// {{#if user}}
// <li><a href="#">Bid now</a></li>
// {{/if}}

$(document).on('change', '#sort-option', function () {
  var value = $(this).val();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const keyword = urlParams.get('keyword');
  //var nPages = $('#nPages').val();
  if (value != 'all') {
    $.getJSON(
      `/search/get-list-products-${value}?keyword=${keyword}`,
      function (data) {
        console.log(data);
        if (data.length != 0) {
          $('#products-search-result').text('');
          data.forEach((element) => {
            var fullhtml = parseHTML(element);
            $('#products-search-result').append(fullhtml);
          });
        }
      }
    );
  }
  //   var paginator = parsePaginator(1, nPages);
  //   $('#paginator').html(paginator);
});
