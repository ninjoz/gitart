$(document).ready(function () {
  $("button").on('click', function (event) {

    let name = $(this).attr('name');
    let order_done_button= $(this).attr('id');
    if(order_done_button=="order_done_button"){
event.preventDefault();
      event.stopPropagation();
      let codeId = $(this).attr('name');
      let date = $(this).attr('class');
      console.log(codeId)
      console.log(date)
  
        $.ajax({
  
          url: "/processingFinished",
  
          method: "POST",
  
          contentType: "application/json",
  
          data: JSON.stringify({
            codeId
            ,date
           
          }),
          success: (res) => {
            $('#shipped').append(`<tr><td><a href="/order${codeId}" name="shipped-order-code" >` + codeId + "</a></td><td>"+ date + "</td></tr>")
            $(this).parent().parent().remove();
          }
        }).done((result) => {
          
  
          
  
  
        })
  







    }


    if (name == 'mug-add-button') {
      let mugNumber = parseInt($("#mug_quantity").text());
      let EnteredMugNum = parseInt($("#Mug-newQuantity").val());
      if(!(isNaN(EnteredMugNum))){
      let finMugNumber = EnteredMugNum + mugNumber;
    


      $.ajax({

        url: "/admin",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          EnteredMugNum
        }),
        success: (res) => {
          $("#mug_quantity").text(finMugNumber)
        }
      }).done((result) => {
        handleAdd("Mug-newQuantity");


      })}
      event.preventDefault();
      event.stopPropagation();
    }
    else if (name == 'coaster-add-button') {
      let coasterNumber = parseInt($("#coaster_quantity").text());
      let EnteredCoasterNum = parseInt($("#Coaster-newQuantity").val());
      if(!(isNaN(EnteredCoasterNum))){
      let finCoasterNumber = EnteredCoasterNum + coasterNumber;


      $.ajax({

        url: "/admin",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          EnteredCoasterNum
        }),
        success: (res) => {
          $("#coaster_quantity").text(finCoasterNumber)
        }
      }).done((result) => {
        handleAdd("Coaster-newQuantity");


      })
    }
      event.preventDefault();
      event.stopPropagation();
    }
    else if (name == 'Phonecover-add-button') {
      let phoneNumber = parseInt($("#phone_cover_quantity").text());
      let EnteredPhoneNum = parseInt($("#PhoneCover-newQuantity").val());
      if(!(isNaN(EnteredPhoneNum))){
      let finPhoneNumber = EnteredPhoneNum + phoneNumber;


      $.ajax({

        url: "/admin",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          EnteredPhoneNum
        }),
        success: (res) => {
          $("#phone_cover_quantity").text(finPhoneNumber)
        }
      }).done((result) => {
        handleAdd("PhoneCover-newQuantity");


      })
    }
      event.preventDefault();
      event.stopPropagation();
    }
    else if (name == 'Ipadcase-add-button') {
      let ipadNumber = parseInt($("#ipad_case_quantity").text());
      let EnteredIpadNum = parseInt($("#Ipadcase-newQuantity").val());
      
      if(!(isNaN(EnteredIpadNum))){
      let finIpadNumber = EnteredIpadNum + ipadNumber;


      $.ajax({

        url: "/admin",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          EnteredIpadNum
        }),
        success: (res) => {
          $("#ipad_case_quantity").text(finIpadNumber)
        }
      }).done((result) => {
        handleAdd("Ipadcase-newQuantity");


      })
    }
      event.preventDefault();
      event.stopPropagation();
    }
    else if (name == 'laptopsleeve-add-button') {
      let laptopsleeveNumber = parseInt($("#laptop_sleeve_quantity").text());
      let EnteredLaptopsleeveNum = parseInt($("#Laptopsleeve-newQuantity").val());
      if(!(isNaN(EnteredLaptopsleeveNum))){
      let finLaptopsleeveNumber = EnteredLaptopsleeveNum + laptopsleeveNumber;


      $.ajax({

        url: "/admin",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          EnteredLaptopsleeveNum
        }),
        success: (res) => {
          $("#laptop_sleeve_quantity").text(finLaptopsleeveNumber)
        }
      }).done((result) => {
        handleAdd("Laptopsleeve-newQuantity");


      })
    }
      event.preventDefault();
      event.stopPropagation();
    }
    else if (name == 'totebag-add-button') {
      let totebagNumber = parseInt($("#tote_bag_quantity").text());
      let EnteredTotebagNum = parseInt($("#Totebag-newQuantity").val());
      if(!(isNaN(EnteredTotebagNum))){
      let finTotebagNumber = EnteredTotebagNum + totebagNumber;


      $.ajax({

        url: "/admin",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          EnteredTotebagNum
        }),
        success: (res) => {
          $("#tote_bag_quantity").text(finTotebagNumber)
        }
      }).done((result) => {
        handleAdd("Totebag-newQuantity");


      })
    }
      event.preventDefault();
      event.stopPropagation();
    }
    else if (name == 'tshirt-add-button') {
      let tshirtNumber = parseInt($("#tshirt_quantity").text());
      let EnteredTshirtNum = parseInt($("#Tshirt-newQuantity").val());
      if(!(isNaN(EnteredTshirtNum))){
      let finTshirtNumber = EnteredTshirtNum + tshirtNumber;


      $.ajax({

        url: "/admin",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          EnteredTshirtNum
        }),
        success: (res) => {
          $("#tshirt_quantity").text(finTshirtNumber)
        }
      }).done((result) => {
        handleAdd("Tshirt-newQuantity");


      })
    }
      event.preventDefault();
      event.stopPropagation();
    }
    else if (name == 'notebook-add-button') {
      let notebookNumber = parseInt($("#notebook_quantity").text());
      let EnteredNotebookNum = parseInt($("#Notebook-newQuantity").val());
      if(!(isNaN(EnteredNotebookNum))){
      let finNotebookNumber = EnteredNotebookNum + notebookNumber;


      $.ajax({

        url: "/admin",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          EnteredNotebookNum
        }),
        success: (res) => {
          $("#notebook_quantity").text(finNotebookNumber)
        }
      }).done((result) => {
        handleAdd("Notebook-newQuantity");


      })
    }
      event.preventDefault();
      event.stopPropagation();
    }
    else if (name == 'laptopskin-add-button') {
      let laptopskinNumber = parseInt($("#laptop_skin_quantity").text());
      let EnteredLaptopskinNum = parseInt($("#Laptopskin-newQuantity").val());
      if(!(isNaN(EnteredLaptopskinNum))){
      let finLaptopskinNumber = EnteredLaptopskinNum + laptopskinNumber;


      $.ajax({

        url: "/admin",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          EnteredLaptopskinNum
        }),
        success: (res) => {
          $("#laptop_skin_quantity").text(finLaptopskinNumber)
        }
      }).done((result) => {
        handleAdd("Laptopskin-newQuantity");


      })
    }
      
      event.preventDefault();
      event.stopPropagation();
    }
    else if (name == 'poster-add-button') {
      let posterNumber = parseInt($("#poster_quantity").text());
      let EnteredPosterNum = parseInt($("#Poster-newQuantity").val());
      if(!(isNaN(EnteredPosterNum))){
      let finPosterNumber = EnteredPosterNum + posterNumber;


      $.ajax({

        url: "/admin",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          EnteredPosterNum
        }),
        success: (res) => {
          $("#poster_quantity").text(finPosterNumber)
        }
      }).done((result) => {
        handleAdd("Poster-newQuantity");


      })
    }
      event.preventDefault();
      event.stopPropagation();
    }
    else if (name == 'frame-add-button') {
      let frameNumber = parseInt($("#frame_quantity").text());
      let EnteredFrameNum = parseInt($("#Frame-newQuantity").val());
      if(!(isNaN(EnteredFrameNum))){
      let finFrameNumber = EnteredFrameNum + frameNumber;


      $.ajax({

        url: "/admin",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          EnteredFrameNum
        }),
        success: (res) => {
          $("#frame_quantity").text(finFrameNumber)
        }
      }).done((result) => {
        handleAdd("Frame-newQuantity");


      })}
      event.preventDefault();
      event.stopPropagation();
    }
    else if (name == 'a4-add-button') {
      let a4Number = parseInt($("#a4_quantity").text());
      let EnteredA4Num = parseInt($("#A4-newQuantity").val());
      if(!(isNaN(EnteredA4Num))){
      let finA4Number = EnteredA4Num + a4Number;


      $.ajax({

        url: "/admin",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          EnteredA4Num
        }),
        success: (res) => {
          $("#a4_quantity").text(finA4Number)
        }
      }).done((result) => {
        handleAdd("A4-newQuantity");


      })}
      event.preventDefault();
      event.stopPropagation();
    }
    else if (name == 'sticker-add-button') {
      let stickerNumber = parseInt($("#sticker_quantity").text());
      let EnteredStickerNum = parseInt($("#Sticker-newQuantity").val());
      if(!(isNaN(EnteredStickerNum))){
      let finStickerNumber = EnteredStickerNum + stickerNumber;


      $.ajax({

        url: "/admin",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          EnteredStickerNum
        }),
        success: (res) => {
          $("#sticker_quantity").text(finStickerNumber)
        }
      }).done((result) => {
        handleAdd("Sticker-newQuantity");


      })}
      event.preventDefault();
      event.stopPropagation();
    }










  }


  )
})
function handleAdd(inputId) {
  // محو قيمة حقل النص الذي يلي الزر
  var quantityField = document.getElementById(inputId);

  quantityField.value = "";

}
