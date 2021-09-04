import firebase from 'firebase/app';
import "firebase/storage";
import fire from 'firebase';
// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
// const messaging = firebase.messaging();
// messaging.getToken({ vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>' }).then((currentToken) => {
//   if (currentToken) {
//     // Send the token to your server and update the UI if necessary
//     // ...
//   } else {
//     // Show permission request UI
//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// }).catch((err) => {
//   console.log('An error occurred while retrieving token. ', err);
//   // ...
// });

var firebaseConfig = {
    apiKey: "AIzaSyAAyugfzxeGnBYcqQhmFGG8QdbdV23BeM4",
    authDomain: "plms-d3fdd.firebaseapp.com",
    projectId: "plms-d3fdd",
    storageBucket: "plms-d3fdd.appspot.com",
    messagingSenderId: "28711992147",
    appId: "1:28711992147:web:91382ede1c8fcbec1abfa6"
  };
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  
  // Get a reference to the storage service, export it for use
  export const storage = firebase.storage();
  const messaging = fire.messaging();
  messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // ...
  });

  // messaging.onBackgroundMessage((payload) => {
  //   console.log('[firebase-messaging-sw.js] Received background message ', payload);
  //   // Customize notification here
  //   const notificationTitle = 'Background Message Title';
  //   const notificationOptions = {
  //     body: 'Background Message body.',
  //     icon: '/firebase-logo.png'
  //   };
  
  //   this.registration.showNotification(notificationTitle,
  //     notificationOptions);
  // });
  
  export   {fire};
  export default firebase;
