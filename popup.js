document.addEventListener("DOMContentLoaded", () => {
    // definition of elements in our popup extension (HTML)
    
    // permission stuff
    const microphoneButton = document.getElementById("toggle-microphone");
    const cameraButton = document.getElementById("toggle-camera");
    const locationButton = document.getElementById("toggle-location");

    // site log stuff
    const logList = document.getElementById("log-list");
    const toggleButton = document.getElementById("toggle-extension");
    const logo = document.getElementById("logo");

    // AI stuff
    const generateAIActionButton = document.getElementById("generate-ai-action");
    const AIOutputDiv = document.getElementById("ai-output");
    // PLEASE: dont abuse our k here: we've left it here so you can see how it works, but we will be removing it soon
    const encoded = "c2stcHJvai0yRmhBLVRFbGZDVU5iRjJicm44MWJRaXFpbnpCN1BBb3VhWklpamZna2FITFFWdVhYNHIxdnN6cENhOVRSSEMxR1QzaGpMUy0zalQzQmxia0ZKWVNUcjA1RVFWQ1RTTHJVMFptT3VZV2hMZm01QnB1cWg5M2tyS2pIVUpQMVRaOTBRUTktV2pzN0MtYUNEcDROVEwzT20yazF4Y0E=";

    // restrict site stuff
    const restrictedSitesList = document.getElementById("restricted-sites-list");
    const siteInput = document.getElementById("site-url");
    const addSiteButton = document.getElementById("add-site");
  
    // permissions object to keep track of the permission states of the extension
    let permissions = {
      microphone: true,
      camera: true,
      location: true
    };

    chrome.storage.local.get("permissions", (data) => {
      if (data.permissions) {
        permissions = data.permissions;
        updatePermissionButtons();
      }
    });

    // initialize an empty array for the restricted sites
    let restrictedSites = [];

    chrome.storage.local.get("restrictedSites", (data) => {
      if (data.restrictedSites) {
          restrictedSites = data.restrictedSites;
          // reapply restrictions for the sites
          restrictedSites.forEach((site) => {
            try {
                chrome.contentSettings.javascript.set({
                    primaryPattern: `*://${site}/*`,
                    setting: "block",
                });
                chrome.contentSettings.images.set({
                    primaryPattern: `*://${site}/*`,
                    setting: "block",
                });
                chrome.contentSettings.cookies.set({
                    primaryPattern: `*://${site}/*`,
                    setting: "block",
                });
            } catch (error) {
                console.error(`Failed to reapply restrictions for ${site}:`, error);
            }
          });        
          updateRestrictedSitesList();
      }
    });

    function updatePermissionButtons() {
      /**
       * updatePermissionButtons function is used to update the state of the permission buttons
       *   based on the current permissions.
       * 
       * Takes no parameters
       */
      microphoneButton.classList.toggle("disabled", !permissions.microphone);
      cameraButton.classList.toggle("disabled", !permissions.camera);
      locationButton.classList.toggle("disabled", !permissions.location);
    }

    function updateRestrictedSitesList() {
      /**
       * updateRestrictedSitesList function is used to update the list of restricted sites
       *  and display them in the popup.
       * 
       * Takes no parameters
       */

      restrictedSitesList.innerHTML = "";
  
      restrictedSites.forEach((site) => {
          const li = document.createElement("li");
          // in the HTML, we only need first 25 characters
          li.textContent = site.length > 25 ? `${site.slice(0, 25)}...` : site;
  
          const removeButton = document.createElement("button");
          removeButton.textContent = "Remove";
          removeButton.style.marginLeft = "10px";
          removeButton.addEventListener("click", () => {
              removeRestrictedSite(site);
          });
  
          li.appendChild(removeButton);
          restrictedSitesList.appendChild(li);
      });
    }

    function removeRestrictedSite(site) {
      /**
       * removeRestrictedSite function is used to remove a restricted site
       *  from the list of restricted sites
       * 
       * @param {string} site - the site to remove from the restricted sites list
       */

      restrictedSites = restrictedSites.filter((s) => s !== site);
      // remove in the content settings as well
      try {
        chrome.contentSettings.javascript.set({
            primaryPattern: `*://${site}/*`,
            setting: "allow",
        });
        chrome.contentSettings.images.set({
            primaryPattern: `*://${site}/*`,
            setting: "allow",
        });
        chrome.contentSettings.cookies.set({
            primaryPattern: `*://${site}/*`,
            setting: "allow",
        });
      } catch (error) {
        console.error(`Failed to remove restrictions for ${site}:`, error);
        alert(`An error occurred while removing restrictions for ${site}.`);
      }
      chrome.storage.local.set({ restrictedSites });
      updateRestrictedSitesList();
  
      alert(`Resources for ${site} have been unrestricted.`);
    }
  

    function updateExtensionState(enabled) {
      /**
       * updateExtensionState function is used to update the extension state
       *     and the icon of the extension (enabled/disabled).
       * 
       * @param {boolean} enabled - the state of the extension
       */
      const icon = enabled ? "images/icon19.png" : "images/icon-disabled19.png";
      const logoAddress = enabled ? "images/logo-curved.png" : "images/logo-curved-disabled.png";
      toggleButton.textContent = enabled ? "Disable" : "Enable";
      toggleButton.classList.toggle("disabled", !enabled);
      const appContainer = document.getElementById("app");

      if (!enabled) {
          // styling
          document.body.classList.add("extension-disabled");
          appContainer.classList.add("extension-disabled");

          // toggle the actual setting of the permissions only if that permission is disabled
          if (!permissions.microphone) {
              togglePermission("microphone");
          }
          if (!permissions.camera) {
              togglePermission("camera");
          }
          if (!permissions.location) {
              togglePermission("location");
          }

          // temporarily remove restrictions for all restricted sites
          restrictedSites.forEach((site) => {
            try {
                chrome.contentSettings.javascript.set({
                    primaryPattern: `*://${site}/*`,
                    setting: "allow",
                });
                chrome.contentSettings.images.set({
                    primaryPattern: `*://${site}/*`,
                    setting: "allow",
                });
                chrome.contentSettings.cookies.set({
                    primaryPattern: `*://${site}/*`,
                    setting: "allow",
                });
            } catch (error) {
                console.error(`Failed to remove restrictions for ${site}:`, error);
            }
          });

          // update the buttons to reflect the new permission state
          permissions.microphone = true;
          permissions.camera = true;
          permissions.location = true;
          updatePermissionButtons();
          chrome.storage.local.set({ permissions });
      }
      else {
        // styling
        document.body.classList.remove("extension-disabled");
        appContainer.classList.remove("extension-disabled");

        // reapply restrictions for the sites
        restrictedSites.forEach((site) => {
          try {
              chrome.contentSettings.javascript.set({
                  primaryPattern: `*://${site}/*`,
                  setting: "block",
              });
              chrome.contentSettings.images.set({
                  primaryPattern: `*://${site}/*`,
                  setting: "block",
              });
              chrome.contentSettings.cookies.set({
                  primaryPattern: `*://${site}/*`,
                  setting: "block",
              });
          } catch (error) {
              console.error(`Failed to reapply restrictions for ${site}:`, error);
          }
        });
      }

      logo.src = logoAddress;

      chrome.storage.local.set({ enabled });
      chrome.action.setIcon({ path: icon });
    }

    function toggleExtension() {
        /**
         * toggleExtension function is used to toggle the extension state
         *    and update the extension state (again, enabled/disabled).
         * 
         * Takes no parameters.
         */
        chrome.storage.local.get("enabled", (data) => {
            const currentState = data.enabled !== undefined ? data.enabled : true;
            updateExtensionState(!currentState);
        });
    }

    // our extension is enabled by default
    chrome.storage.local.get("enabled", (data) => {
        const enabled = data.enabled !== undefined ? data.enabled : true;
        updateExtensionState(enabled);
    });
  
    function updateLogs() {
      /**
       * updateLogs function is used to update the logs of the extension
       *   and display (formatted) them in the popup, specifically for the resource-intensive
       *   requests.
       * 
       * Takes no parameters
       */
      chrome.storage.local.get("trackedData", (data) => {
        const trackedData = data.trackedData || {};
        logList.innerHTML = "";
        // weight factor balances the impact of the number of requests
        // when W > 1, smaller and more frequent requests are emphasized, and when W < 1, larger and less frequent requests are emphasized
        const weightFactor = 1.3; // CURRENTLY: equally weights many requests more than large requests
        const sortedData = Object.entries(trackedData)
            .map(([site, info]) => ({
                site,
                count: info.count,
                size: info.size,
                // currently defining a metric to determine the most resource-intensive requests
                // Unified Metric = Size (KB) + (Weight Factor * Count)
                metric: (info.size / 1024) + (weightFactor * info.count), // in KB
            }))
            .sort((a, b) => b.metric - a.metric) // sort by metric, descending
            .slice(0, 5); // top 5 most resource-intensive requests
        
        let counter = 0;
        sortedData.forEach(({ site, count, size, metric }) => {
            const sizeForDisplay = size > 900 * 1024  // since size is initially in bytes
                ? `${(size / (1024 * 1024)).toFixed(2)} MB`
                : `${(size / 1024).toFixed(2)} KB`;
            const li = document.createElement("li");
            const li2 = document.createElement("li");
            // we only need the first 35 characters in the HTML
            li.textContent = site.length > 35 ? `${site.slice(0, 35)}...` : site;

            // if the site is the extension itself, let the user know and add a smiley face, it looks deterring as the extension id
            if (site == "kbclflkapnlphmmeaaelbngfcdjfomjf") {
                li.textContent = "Trackle (Web) " + String.fromCodePoint(0x1F609);
            }
            // if the site is number 1 resource usage and not the extension, add the mind-blown emoji
            else if (counter == 0) {
                li.textContent = (site.length > 35 ? `${site.slice(0, 35)}...` : site) + " " + String.fromCodePoint(0x1F92F);
                counter++;
            }
            // we say that a large number of requests is >= 60 and a large size is >= 1.5 MB
            // so, a corresponding site with both has a metric >= 1.3*60 + 1536 = 1614 metric kB
            // if so, we add the burning up face emoji
            else if (metric > 1614) {
                li.textContent = (site.length > 35 ? `${site.slice(0, 35)}...` : site) + " " + String.fromCodePoint(0x1F975);
            }

            logList.appendChild(li);
            li2.style.marginLeft = "20px";
            li2.textContent = `- Requests: ${count}, Size: ${sizeForDisplay}`;
            logList.appendChild(li2);
        });

        // see if we can generate an AI action
        generateAIActionButton.onclick = () => generateAIRecommendations(sortedData);
      });
    }

  async function generateAIRecommendations(sortedData) {
    /**
     * generateAIRecommendations function is used to generate AI recommendations
     *  from an OpenAI engine based on the top 5 most resource-intensive websites.
     * 
     * @param {Array} sortedData - the sorted data of the top 5 most resource-intensive websites
     */

    AIOutputDiv.innerHTML = "<p>Generating AI recommendations...</p>";
    const siteDetails = sortedData.map(({ site, count, size }) =>
      `${site} - Requests: ${count}, Size: ${(size / 1024).toFixed(2)} KB`).join("\n");

    const messages = [{ role: "system", content: "You are the chrome extension Trackle. Designed to help users take control of their permissions and resource allocation, you will be given website input and you need to make the proper answer/suggestion. Our extension has the direct ability to limit web resources for a input website. So, primarliy, the NUMBER ONE thing we essentially always want to do is suggest utilizing that in-extension feature. Suggest actions the user could in the most useful way: don't say what we already know, like what's the most intensive, but instead only suggest actual actions (not like viewing the site less) like blocking ads on that website (only suggest this one for a website with a high request count, and do so EXTREMELY sparingly) or closing the tab where that website comes from (as it doesn't always look like its coming from the Amazon tab for example, but the site may originate from it: in other words, be creative and give action. Additionally, if the top site or 2 is kbclflkapnlphmmeaaelbngfcdjfomjf, that is the extension itself and should be ignored. Also, do not put in the response the url of the site, unless it is very vague where it came from. Example: m.media-amazon.com or images-na.ssl-images-amazon.com: those are both Amazon, so just say that and consider all of those sources 1 item, so you can analyze the next distinct resource-utilizing site the user could take action on. Finally, if a site name or url that you are about to include is over 25 characters, consider shortening it for the user output." },
                      {role: "user", content: `Here are the top 5 most resource-intensive websites:\n${siteDetails}\n\nOnly suggest the number 1 action the user can take to optimize their browser performance based on this, 2 if really needed. Do all of this in 3 sentences.`}
                    ];

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${new TextDecoder().decode(new TextEncoder().encode(atob(encoded)))}`,
        },
        body: JSON.stringify({
          // model we are using is the gpt-4o
          model: "gpt-4",
          messages: messages,
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiRecommendation = data.choices[0].message.content;
      AIOutputDiv.innerHTML = `<p>${aiRecommendation}</p>`;
    } catch (error) {
      console.error("Failed to generate AI recommendations: ", error);
      AIOutputDiv.innerHTML = "<p>Failed to generate AI recommendations. Please try again.</p>";
    }

  }
  
    function togglePermission(type) {
      /**
       * togglePermission function is used to toggle the permissions
       *   of the extension (microphone, camera, location).
       *   Also alerts the user of the change in permission.
       * 
       * @param {string} type - the type of permission to toggle
       */

      // actually disable the permission for the entire browser
      let contentSettingType = "";
      let newSetting = permissions[type] ? "block" : "allow"; // by default, allow/block are valid choices

      if (type == "microphone") {
        contentSettingType = "microphone";
        newSetting = permissions[type] ? "block" : "ask";
      }
      else if (type == "camera") {
        contentSettingType = "camera";
        newSetting = permissions[type] ? "block" : "ask";
      }
      else if (type == "location") {
        contentSettingType = "location";
        newSetting = permissions[type] ? "block" : "allow";
      }
      else {
        console.error("Unknown permission type");
        return;
      }

      chrome.contentSettings[contentSettingType].set({
        primaryPattern: "<all_urls>", // since we want it to apply to all websites
        setting: newSetting,
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("Failed to update content setting: ", chrome.runtime.lastError.message);
        }
        else {
          console.log(`${type} permission ${permissions[type] ? "enabled" : "disabled"}`);
        }
      });

      // update the permissions object, notifying the user of the change
      permissions[type] = !permissions[type];
      chrome.storage.local.set({ permissions });
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} ${permissions[type] ? "enabled" : "disabled"}`);

      // update the button to reflect the new permission state
      const button = document.getElementById(`toggle-${type}`);
      button.classList.toggle("disabled", !permissions[type]);
    }
  
    // event listeners for the buttons in the popup extension
    microphoneButton.addEventListener("click", () => togglePermission("microphone"));
    cameraButton.addEventListener("click", () => togglePermission("camera"));
    locationButton.addEventListener("click", () => togglePermission("location"));
    toggleButton.addEventListener("click", toggleExtension);
    addSiteButton.addEventListener("click", () => {
      // we need to remove whitespace, but we also need to remove the protocol (https, etc.) and trailing slashes and paths
      const url = siteInput.value.trim().replace(/(^\w+:|^)\/\//, "").replace(/\/.*/, ""); // comes from https://stackoverflow.com/a/19709846, regex to remove protocol and paths
  
      if (!url) {
          alert("Please enter a valid URL.");
          return;
      }
  
      // check if the URL is already restricted
      if (restrictedSites.includes(url)) {
          alert("This site is already restricted.");
          return;
      }
  
      restrictedSites.push(url);
      chrome.storage.local.set({ restrictedSites });
      updateRestrictedSitesList();
      siteInput.value = ""; // clear input field
  
      // apply resource limitations using chrome.contentSettings
      try {
        chrome.contentSettings.javascript.set({
            primaryPattern: `*://${url}/*`,
            setting: "block",
        });
        chrome.contentSettings.images.set({
            primaryPattern: `*://${url}/*`,
            setting: "block",
        });
        chrome.contentSettings.cookies.set({
            primaryPattern: `*://${url}/*`,
            setting: "block",
        });
        alert(`Resources for ${url} have been restricted.`);
      } catch (error) {
        console.error(`Failed to restrict resources for ${url}:`, error);
        alert(`An error occurred while restricting resources for ${url}.`);
      }
    });  
  
    updateLogs();
  });
