$(document).ready(function () {
  $("button").on('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    let id = $(this).attr('id');

    if (id == 'follow-button') {
      let followOrUnfollow = $('#follow-button').text();
      console.log(followOrUnfollow);
      let following = $(this).val();
      
      let followersNumber =parseInt( $("#followersNumber").text());
      console.log(followersNumber)
      if(followOrUnfollow=='unfollow'){
        followersNumber-=1;
        console.log(followersNumber)


      }
      else if(followOrUnfollow=='Follow'){

        followersNumber+=1;
        console.log(followersNumber)

      }
      


      $.ajax({

        url: "/follow",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          following
         
        }),
        success: (res) => {
          $("#followersNumber").text(followersNumber)
        }
      }).done((result) => {
        handleFollow();


      })








    }
    else if(id == 'remove'){
let design_id= $(this).attr('name');
let artworkNum= parseInt($("#artworks_number").text());
artworkNum-=1;


$.ajax({

  url: "/remove",

  method: "POST",

  contentType: "application/json",

  data: JSON.stringify({
    design_id
  }),
  success: (res) => {
    $(this).parent().remove();
    $("#artworks_number").text(artworkNum);
    
  }
  
})



    }
    else {

      let isLiked = $(this).val();
      design_id= $(this).attr('id');
      let likes = parseInt($(`#${design_id}`).text());
      console.log(likes)
      console.log(likes)
      if (isLiked == 'notLiked') {
        likes+=1;
        
        $(this).attr("value", "Liked");
        $(this).attr("style", "border: none; outline: none;background-color: transparent; color:Tomato;");
        $(`#${design_id}`).text(likes)

      }
      else {
        likes-=1;
        $(this).attr("value", "notLiked");
        $(this).attr("style", "border: none; outline: none;background-color: transparent;color:rgb(0, 5, 15);");
        $(`#${design_id}`).text(likes)
      }

      $.ajax({

        url: "/heartedDesign",

        method: "POST",

        contentType: "application/json",

        data: JSON.stringify({
          "design_id": $(this).attr('id'),
          "isLiked": $(this).val()
        }),
        success: (res) => {
          
        }
      })
    }



  }


  )
})
function handleFollow() {
  var state = document.querySelector('#follow-button').textContent;
  if (state == "Follow") {
      console.log('followed artist');
      document.querySelector('#follow-button').textContent = 'unfollow';
      document.getElementById('follow-button').style.color = "rgb(150, 150, 150)";
  } else if (state == "unfollow") {
      console.log('unfollowed artist');
      document.querySelector('#follow-button').textContent = 'Follow';
      document.getElementById('follow-button').style.color = "rgb(0,0,0)";
  }
}