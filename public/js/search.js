// $(document).on('change', '#sort-option', function () {
//   var value = $(this).val();
//   const queryString = window.location.search;
//   const urlParams = new URLSearchParams(queryString);
//   const key = urlParams.get('key');
//   var nPages = $('#nPages').val();
//   if (value != 'all') {
//     $.getJSON(
//       `/course/search/get-list-courses-${value}?key=${key}&page=1`,
//       function (data) {
//         if (data.length != 0) {
//           $('#list-courses').text('');
//           data.forEach((element) => {
//             var fullhtml = parseHTML(element);
//             $('#list-courses').append(fullhtml);
//           });
//         }
//       }
//     );
//   }
//   var paginator = parsePaginator(1, nPages);
//   $('#paginator').html(paginator);
// });
