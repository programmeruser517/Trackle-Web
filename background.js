let trackedData = {};

function trackRequest(site, size) {
    /**
     * trackRequest function is used to track and allow for
     *      updating the trackedData object with the size of the
     *      request and the count of the request.
     * 
     * @param {string} site - the website url of the request
     * @param {number} size - the size of the request
     */

    chrome.storage.local.get("trackedData", (data) => {
        const trackedData = data.trackedData || {};

        // to initialize an empty object if it has no requests or its info packet returns null
        if (!trackedData[site]) {
            trackedData[site] = { count: 0, size: 0 };
        }

        trackedData[site].count += 1;
        trackedData[site].size += size;
        chrome.storage.local.set({ trackedData });
    });
}

chrome.webRequest.onCompleted.addListener(
  (details) => {
    chrome.storage.local.get("enabled", (data) => {
      if (!data.enabled) return; // modified to skip if extension is disabled

      const url = new URL(details.url).hostname;

      // where we are grabbing from the response headers and adding up the content-length values
      const size = details.responseHeaders.reduce((acc, header) => {
        
        if (header.name.toLowerCase() === "content-length") {
          return acc + parseInt(header.value, 10);
        }
        return acc;

      }, 0);

      trackRequest(url, size);

      // to initialize an empty object if it has no requests or its info packet returns null
      if (!trackedData[url]) {
        trackedData[url] = { count: 0, size: 0 };
      }
      trackedData[url].count++;
      // again, adding the size of the request to the trackedData object
      trackedData[url].size += details.responseHeaders?.reduce((acc, header) => {
        return header.name.toLowerCase() === 'content-length' ? acc + parseInt(header.value || '0') : acc;
      }, 0) || 0;

      chrome.storage.local.set({ trackedData });
    });
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"] // we now need the response headers, don't remove
);
