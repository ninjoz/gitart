$(document).ready(function () {
  let start_index = $("#loadMoreBtn").data("start-index");
  let num_record = $("#loadMoreBtn").data("num-record");
  let searchQuery = $("#loadMoreBtn").attr("name");
  let sort_order = $("#sortOrder").val(); 
  let loading = false;


  $("#sortOrder").change(function () {
    
    sort_order = $(this).val();

   
    $('.products[name="products_view"]').html('');
    start_index = 0;

    
    loadMoreResults();
  });

  $(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100 && !loading) {
      console.log('Near the bottom!'); 
      loadMoreResults();
    }
  });

  function loadMoreResults() {
    console.log('i am called');
    console.log(searchQuery);
    console.log(start_index);
    console.log(num_record);
    console.log(sort_order); 
    
    loading = true;

    $.ajax({
      url: `/search?start_index=${encodeURIComponent(start_index)}&num_record=${encodeURIComponent(num_record)}&search_query=${encodeURIComponent(searchQuery)}&sort_order=${encodeURIComponent(sort_order)}`,
      type: 'POST',
      success: function (data) {
        if (data.trim().length > 0) {
          //  if this is the initial load
          if (start_index === 0) {
            $('.products[name="products_view"]').html('');
          }

          // Append new results
          $('.products[name="products_view"]').append($(data));
        
          start_index += num_record;
        } else {
          // No more results
          console.log('No more results.');
        }

        loading = false;
      },
      error: function (error) {
        console.error(error);
        loading = false;
      }
    });
  }
});
