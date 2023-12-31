$('document').ready(function () {
  $("#addToCart").on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    let id = $(this).attr('id');
    let proId= $('#quantity').attr('name');
    let AddorRemove='';
     state = document.querySelector(`#${id}`).textContent;
  if (state == "Add to Cart") {
    AddorRemove="Remove"
  } else if (state == "Remove from Cart") {
    AddorRemove="Add"
  }
      let quantity = parseInt($("#quantity").val());
      if(!(isNaN(quantity))){
    


      $.ajax({

        url: "/cart",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          quantity,
          AddorRemove,
          proId

        }),
        success: (res) => {
          handleCartBtn(id);
        }
      }).done((result) => {
        handleAdd("quantity");


      })}
     
  

  }
  )
})
function handleCartBtn(id) {
  var state = document.querySelector(`#${id}`).textContent;
  if (state == "Add to Cart") {
      //console.log('followed artist');
      document.querySelector(`#${id}`).textContent = 'Remove from Cart';
      document.getElementById(id).style.color = "rgb(150, 150, 150)";
  } else if (state == "Remove from Cart") {
      //console.log('unfollowed artist');
      document.querySelector(`#${id}`).textContent = 'Add to Cart';
      document.getElementById(id).style.color = "rgb(0,0,0)";
  }
}
/*function handleAdd(inputId) {
  // محو قيمة حقل النص الذي يلي الزر
  var quantityField = document.getElementById(inputId);

  quantityField.value = "";

}*/