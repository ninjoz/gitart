/**
 *  var enabledProducts = [];

    $(".toggle-button").on('click', function () {
        var $button = $(this);
        var templateName = $button.attr("name"); // Use the name attribute as the identifier
        var templateID = $button.attr("id");
        var currentState = $button.data("enabled");

        if (currentState === "disabled") {
            $button.text("Enabled");
            $button.css("background", "red");
            $button.data("enabled", "enabled");
            enabledProducts.push(templateName); 
            enabledProducts.push(templateID); // Store the name attribute
        } else {
            $button.text("Disabled");
            $button.css("background", "linear-gradient(to bottom, #57d757, #98ca98)");
            $button.data("enabled", "disabled");
            enabledProducts = enabledProducts.filter(function(item) {
                return item !== templateName&& item !== templateID;

            });
        }
 */
$(document).ready(function () {
   
    
    $('#input-file').on('change', function() {
        // Check if files are selected and the first file is an image
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            
            // Function to execute once the file is read
            reader.onload = function(e) {
                // Get the image preview element by its id
                var previewImg = $('#preview-img');
                // Set the src of the image to the read file data
                previewImg.attr('src', e.target.result);
                // Make the image visible by changing the display style
                previewImg.show();

                var previewImg = $('#tshirt-image');
                // Set the src of the image to the read file data
                previewImg.attr('src', e.target.result);
                // Make the image visible by changing the display style
                previewImg.show();

                var previewImg = $('#tshirt-image');
                // Set the src of the image to the read file data
                previewImg.attr('src', e.target.result);
                // Make the image visible by changing the display style
                previewImg.show();

                var previewImg = $('#tote-image');
                // Set the src of the image to the read file data
                previewImg.attr('src', e.target.result);
                // Make the image visible by changing the display style
                previewImg.show();
                
                var previewImg = $('#sticker-image');
                // Set the src of the image to the read file data
                previewImg.attr('src', e.target.result);
                // Make the image visible by changing the display style
                previewImg.show();
                var previewImg = $('#poster-image');
                // Set the src of the image to the read file data
                previewImg.attr('src', e.target.result);
                // Make the image visible by changing the display style
                previewImg.show();

                var previewImg = $('#phoneCover-image');
                // Set the src of the image to the read file data
                previewImg.attr('src', e.target.result);
                // Make the image visible by changing the display style
                previewImg.show();

                var previewImg = $('#notebook-image');
                // Set the src of the image to the read file data
                previewImg.attr('src', e.target.result);
                // Make the image visible by changing the display style
                previewImg.show();
                
                var previewImg = $('#mug-image');
                // Set the src of the image to the read file data
                previewImg.attr('src', e.target.result);
                // Make the image visible by changing the display style
                previewImg.show();
                var previewImg = $('#laptopSleeve-image');
                // Set the src of the image to the read file data
                previewImg.attr('src', e.target.result);
                // Make the image visible by changing the display style
                previewImg.show();

                var previewImg = $('#laptopSkin-image');
                // Set the src of the image to the read file data
                previewImg.attr('src', e.target.result);
                // Make the image visible by changing the display style
                previewImg.show();

                var previewImg = $('#ipadCase-image');
                // Set the src of the image to the read file data
                previewImg.attr('src', e.target.result);
                // Make the image visible by changing the display style
                previewImg.show();
                
                var previewImg = $('#frame-image');
                // Set the src of the image to the read file data
                previewImg.attr('src', e.target.result);
                // Make the image visible by changing the display style
                previewImg.show();
                var previewImg = $('#coaster-image');
                // Set the src of the image to the read file data
                previewImg.attr('src', e.target.result);
                // Make the image visible by changing the display style
                previewImg.show();
                var previewImg = $('#a4-image');
                // Set the src of the image to the read file data
                previewImg.attr('src', e.target.result);
                // Make the image visible by changing the display style
                previewImg.show();



            };
            
            // Read the selected file as a Data URL
            reader.readAsDataURL(this.files[0]);
        }
    });


});
