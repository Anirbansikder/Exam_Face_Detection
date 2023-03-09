// Establish a connection with the background script
const port = chrome.runtime.connect({ name: 'mediaAccess' });

// Request media access
port.postMessage({ message: 'requestMediaAccess' });

// Listen for the response
port.onMessage.addListener(response => {
  if (response.success) {
    startCamera();
  } else {
    console.error('Error:', response.error);
  }
});
