$(document).ready(function () {
  $("button").on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    let codeId = $(this).attr('name');
    let date = $(`#${codeId}`).attr('name');
    
      $.ajax({

        url: "/deliveryCheck",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          codeId
          ,date
         
        }),
        success: (res) => {
          $(this).val("confirmed");
          $(`#${codeId}`).text(date)
          $(`#status${codeId}`).text("Delivered");
        }
      }).done((result) => {
       

        $(this).attr("disabled", true);


      })








    

  
})
})
