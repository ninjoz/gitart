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
     var enabledProducts = [];
   $(".toggle-button").on('click', function () {
    var $button = $(this);
    var templateName = $button.attr("name");
    var templateID = $button.attr("id");
    var currentState = $button.data("enabled");

    if (currentState === "disabled") {
        $button.text("Enabled");
        $button.css("background", "red");
        $button.data("enabled", "enabled");
        enabledProducts.push({ id: templateID }); // Store as an object
    } else {
        $button.text("Disabled");
        $button.css("background", "linear-gradient(to bottom, #57d757, #98ca98)");
        $button.data("enabled", "disabled");
        enabledProducts = enabledProducts.filter(function(item) {
            return item.id !== templateID; // Compare by ID
        });
    }
});


    $("#uploadForm").on('submit', function (event) {
        event.preventDefault();

        // Create a FormData object to hold the file data and form inputs
        var formData = new FormData(this);
        formData.append('enabledProducts', JSON.stringify(enabledProducts)); // Add enabled products to the form data

        // Perform the file upload and product saving in one request
        $.ajax({
            type: "POST",
            url: "/upload", // Update the URL to the correct endpoint
            data: formData,
            processData: false, // Prevent jQuery from processing the data
            contentType: false, // Prevent jQuery from setting the content type
            success: function (response) {
                console.log(response);
                alert("File and products saved successfully!");
            },
            error: function (error) {
                console.error(error);
                alert("Error saving file and products!");
            }
        });
    });

//Display image
//Display image
//$(document).ready(function () {
     // Event listener for the file input change
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
            };
            
            // Read the selected file as a Data URL
            reader.readAsDataURL(this.files[0]);
        }
    });


});
