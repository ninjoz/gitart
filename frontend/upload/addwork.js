const droparea =document.getElementById("drop-area");
const inputfile = document.getElementById("input-file");
const imgview = document.getElementById("img-view");
/*const overlayImage = document.getElementById("overlay-image")*/

inputfile.addEventListener("change",uploadimage);

function uploadimage(){

let imglink = URL.createObjectURL(inputfile.files[0]);
 // Set the src attribute of the img element
 imgview.querySelector('img').src = imglink;
    
 // Optionally, you can set the width and height of the img element to match the label
 imgview.querySelector('img').style.width = droparea.offsetWidth + "px";
 imgview.querySelector('img').style.height = droparea.offsetHeight + "px";

 let allOverlayImages = document.querySelectorAll('.design-image');
 allOverlayImages.forEach(overlayImage => {
    overlayImage.src = imglink;
    overlayImage.style.width = "100%";
    overlayImage.style.height = "100%";
});
 
 imgview.style.border = 0;
}

function  updateOverlaySize(value,  imageId) {
     
    var overlayImg = document.getElementById(imageId);
   
   /* overlayImg.style.width = newSize;
    overlayImg.style.height = newSize;*/

    var tshirtImg = overlayImg.previousElementSibling; // Assuming the T-shirt image is a sibling
    var newSize = value + '%';
    
    // Set the maximum size for the overlay image
    var maxSize = 50; // Adjust as needed
    value = Math.min(value, maxSize);

    // Calculate new dimensions
    var newWidth = (tshirtImg.clientWidth * value) / 100;
    var newHeight = (tshirtImg.clientHeight * value) / 100;

    // Ensure the overlay image stays within the T-shirt boundaries
    if (newWidth > tshirtImg.clientWidth) {
        newWidth = tshirtImg.clientWidth;
        newHeight = (newWidth * value) / 100;
    }

    if (newHeight > tshirtImg.clientHeight) {
        newHeight = tshirtImg.clientHeight;
        newWidth = (newHeight * value) / 100;
    }

    overlayImg.style.width = newWidth + 'px';
    overlayImg.style.height = newHeight + 'px';

    // Calculate new position to keep the overlay image centered
    var newLeft = (tshirtImg.clientWidth - newWidth+30) / 2 + 'px';
    var newTop = (tshirtImg.clientHeight - newHeight+37) / 2 + 'px';

    overlayImg.style.left = newLeft;
    overlayImg.style.top = newTop;
     
}


 
 