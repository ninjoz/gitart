document.addEventListener('DOMContentLoaded', function () {
  const autocompleteInput = document.getElementById('autocomplete-input');

  const autoComplete = new Autocomplete({
    selector: autocompleteInput,
    debounceWaitMs: 300, // Optional: Adjust the debounce wait time
    minChars: 1, // Optional: Minimum characters to trigger autocomplete
    source: async function (term, suggest) {
      try {
        // Fetch autocomplete suggestions from your server
        const response = await fetch(`/api/autocomplete?q=${term}`);
        const suggestions = await response.json();

        // Provide suggestions to Autocomplete.js
        suggest(suggestions);
      } catch (error) {
        console.error(error);
      }
    },
    onSelect: function (event, term, item) {
      // Handle the selection of an autocomplete suggestion (optional)
      console.log('Selected:', term);
    },
  });
});
