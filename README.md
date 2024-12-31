# Trackle (Web) 🔍

![Trackle Logo](./images/logo-curved.png)


![Version](https://img.shields.io/badge/version-1.0-blue)
![Chrome Extension](https://img.shields.io/badge/platform-Chrome-green)

A powerful Chrome extension, based on our mobile app [Trackle](https://github.com/programmeruser517/Trackle) that helps you monitor and track website resource usage and permission requests in real-time. For more information regarding the inspiration and motivation behind this project, please refer to the [background](#background) section below and the associated [DevPost](https://devpost.com/software/trackle).

## Background

As the web continues to evolve, websites are becoming increasingly complex and resource-intensive. This can lead to performance issues, privacy concerns, and security risks for users. Especially with the ever-emerging presence of internet bots, AI traffic, and other harmful resource exploitations, Trackle (now on the web) is designed to help you stay informed about the resources that websites are using and the permissions they are requesting. By monitoring and managing website resource usage and permissions, you can optimize your browsing experience and protect your privacy and security online.

## Features

- **Permission Monitoring**: Track and manage website permission requests
- **Permission Monitoring**: Track and manage website permission requests
    - Geolocation access
    - Notification permissions
    - Microphone and camera access
    - And more...

- **Resource Tracking**:
    - Monitor webpage resource consumption
    - Track network requests and responses
    - Analyze performance metrics
    - Real-time resource usage statistics

## Installation

1. Clone this repository or download the ZIP file
```bash
git clone https://github.com/programmeruser517/Trackle-Web.git
```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click on the Trackle extension icon in your Chrome toolbar
2. View real-time statistics about the current website:
    - Active permissions
    - Resource consumption
    - Network activity
3. Access detailed reports and settings through the popup interface
4. Configure notification preferences for permission requests
5. **Directly manage website resource usage and browser permissions**

## Project Structure

```
Trackle Web/
├── manifest.json      # Extension configuration
├── background.js      # Background service worker
├── popup.js           # Popup functionality
├── popup.html         # Popup interface
├── styles.css         # Global styles
├── images/
│   ├── camera.png          # Camera icon
│   ├── geolocation.png     # Geolocation icon
│   ├── logo-curved.png     # Trackle logo
│   ├── microphone.png      # Microphone icon
│   └── icon.png            # Extension icon inclusive
|   └── icon19.png          # Extension icon 19x19 in toolbar
|   └── icon-disabled.png   # Extension icon when disabled
|   └── ...
└── README.md          # Project documentation
```

## Contributing

Contributions are welcome! Please feel free to create an issue, **be responded to** and then submit a Pull Request.

## License

Trackle (Web) © 2024 by Peter Pena, Xiangbo Cai, Krrish Seth, Vishesh Verma is licensed under CC BY-NC 4.0 - see the LICENSE file for details.
