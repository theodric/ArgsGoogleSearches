// Initialize arguments if not present
browser.storage.local.get(['arguments', 'udmEnabled']).then((result) => {
  if (!result.arguments) {
    browser.storage.local.set({ arguments: [] });
  }
  if (result.udmEnabled === undefined) {
    browser.storage.local.set({ udmEnabled: false });
  }
});

// Track processed requests to prevent loops
const processedRequests = new Set();

browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Prevent processing the same request multiple times
    if (processedRequests.has(details.requestId)) {
      return { cancel: false };
    }
    
    return browser.storage.local.get(['arguments', 'udmEnabled']).then((result) => {
      const args = result.arguments || [];
      const enabledArgs = args.filter(arg => arg.enabled);
      const udmEnabled = result.udmEnabled || false;
      
      // Parse the URL to get the search parameters
      const url = new URL(details.url);
      const searchParams = new URLSearchParams(url.search);
      
      // Get the current query
      const query = searchParams.get('q');
      if (!query) return { cancel: false };
      
      // Check if this URL has already been modified by our extension
      // Look for our custom parameter or check if it's a redirect
      const hasUdmParam = searchParams.has('udm');
      const isRedirect = searchParams.has('redirect') || details.type !== 'main_frame';
      
      // Don't modify URLs that already have our parameters or are redirects
      if (hasUdmParam || isRedirect) {
        return { cancel: false };
      }
      
      let hasChanges = false;
      
      // Handle search arguments
      if (enabledArgs.length > 0) {
        // Get all enabled arguments that aren't already in the query
        const newArgs = enabledArgs
          .map(arg => arg.text)
          .filter(arg => !query.includes(arg));
        
        if (newArgs.length > 0) {
          // Append all new arguments to the query
          const newQuery = query + ' ' + newArgs.join(' ');
          searchParams.set('q', newQuery);
          hasChanges = true;
        }
      }
      
      // Handle udm parameter
      if (udmEnabled) {
        searchParams.set('udm', '14');
        hasChanges = true;
      }
      
      if (!hasChanges) {
        return { cancel: false };
      }
      
      // Mark this request as processed
      processedRequests.add(details.requestId);
      
      // Add a flag to indicate this URL was modified by our extension
      searchParams.set('_modified', '1');
      
      // Construct the new URL
      url.search = searchParams.toString();
      
      // Clean up processed requests after a delay
      setTimeout(() => {
        processedRequests.delete(details.requestId);
      }, 5000);
      
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