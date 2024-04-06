$(document).ready(function () {
 

  let start_index = $("#loadMoreBtn").data("start-index");
  let num_record = $("#loadMoreBtn").data("num-record");
  const adding=20;
  let loading = false;

  $(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100 && !loading) {
      console.log('Near the bottom!'); 
      loadMoreResults();
    }
  });

  function loadMoreResults() {
    console.log('i am called');
    console.log(start_index);
    console.log(num_record);
    
    loading = true;
    start_index += adding;
    num_record+=adding;
    $.ajax({
      url: `/home?start_index=${encodeURIComponent(start_index)}&num_record=${encodeURIComponent(num_record)}`,
      type: 'get',
      success: function (data) {
        if (JSON.stringify(data)=='end') {
          //  if this is the initial load
          //if (start_index === 0) {
         //   $('.products[name="products_view"]').html('');
         // }

          // Append new results
         console.log(JSON.stringify(data))
         loading = true;
          //  if this is the initial load
         
        }else{
          $('.products[name="products_view"]').append($(data));
          loading = false;
        }
        
          
        //} else {
          // No more results
         // console.log('No more results.');
        //}

        //loading = false;
      },
      error: function (error) {
        console.error(error);
        loading = false;
      }
    });
  }
});
