


$('document').ready(async function () {
  $("button").on('click', async (event) =>{
    event.preventDefault();
    event.stopPropagation();

    let new_user_name = $("#new_user_name").val();
    let gender = $(".gender:checked").val();

    let accType = $(".accType:checked").val();

    let new_user_email_address = $("#new_user_email_address").val();
    let new_user_password = $("#new_user_password").val();
    let re_new_user_password = $("#re_new_user_password").val();

    console.log(new_user_name)
    console.log(gender)
    console.log(accType)

    console.log(new_user_email_address)
    console.log(new_user_password)
    console.log(re_new_user_password)

    $.ajax({

      url: "/register",
  
      method: "POST",
  
      contentType: "application/json",
  
      data: JSON.stringify({
        new_user_name,
        new_user_email_address,
        new_user_name,
        new_user_password,
        re_new_user_password,gender,accType
      }),
      dataType: 'json',
      success: (res) => {
    
    if(JSON.stringify(res.message)=='""'){
                    window.location.href = "/verification";

          }
          else{
            console.log(JSON.stringify(res.message));
                $('#message').html(JSON.stringify(res.message));
          }
      
      

        
      }
    }).done((result) => {
     
      
    })




















  

  }
  )
})