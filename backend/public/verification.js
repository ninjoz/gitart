$('document').ready(function () {
  $("button").on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();
    let otp = $(this).val();
    let vcode = $("#vcode").val();
    let state="";
console.log(otp)
console.log(vcode)

    
  if (otp == vcode) {
     state = true;
    console.log(state)
    $.ajax({

      url: "/success",
  
      method: "POST",
  
      contentType: "application/json",
      
  
      data: JSON.stringify({
        
  
      }),
      
    
      dataType: 'json',
      success: (res) => {
        console.log("res");
        window.location.replace("/registered");

      }
    }).done((result) => {
     
  
    })






  } else {
     state = false;
    console.log(state)
    $('#v').html("Failed. Please Try Again.");
    
    
   
  }
     

  

  }
  )
})