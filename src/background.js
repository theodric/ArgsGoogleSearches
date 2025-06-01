// Initialize arguments if not present
browser.storage.local.get('arguments').then((result) => {
  if (!result.arguments) {
    browser.storage.local.set({ arguments: [] });
  }
});

browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    return browser.storage.local.get('arguments').then((result) => {
      const args = result.arguments || [];
      const enabledArgs = args.filter(arg => arg.enabled);
      
      if (enabledArgs.length === 0) {
        return { cancel: false };
      }

      // Parse the URL to get the search parameters
      const url = new URL(details.url);
      const searchParams = new URLSearchParams(url.search);
      
      // Get the current query
      const query = searchParams.get('q');
      if (!query) return { cancel: false };
      
      // Get all enabled arguments that aren't already in the query
      const newArgs = enabledArgs
        .map(arg => arg.text)
        .filter(arg => !query.includes(arg));
      
      if (newArgs.length === 0) {
        return { cancel: false };
      }
      
      // Append all new arguments to the query
      const newQuery = query + ' ' + newArgs.join(' ');
      searchParams.set('q', newQuery);
      
      // Construct the new URL
      url.search = searchParams.toString();
      
      // Redirect to the modified URL
      return {
        redirectUrl: url.toString()
      };
    });
  },
  {
    urls: [
      "*://*.google.com/search*"
    ]
  },
  ["blocking"]
); 