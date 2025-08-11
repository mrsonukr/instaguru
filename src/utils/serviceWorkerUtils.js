// Service Worker Registration Utility

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered successfully:', registration);

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            console.log('New service worker available');
          }
        });
      });

      // Handle service worker errors
      registration.addEventListener('error', (error) => {
        console.error('Service Worker registration failed:', error);
      });

      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        console.log('Service Worker unregistered successfully');
      }
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
    }
  }
};

// Check if service worker is causing redirect issues
export const checkServiceWorkerStatus = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        console.log('Service Worker Status:', registration.active ? 'Active' : 'Inactive');
        if (registration.active) {
          console.log('Service Worker Script URL:', registration.active.scriptURL);
        }
      });
    });
  }
};
