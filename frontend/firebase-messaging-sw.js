importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Registration successful, scope is:', registration.scope);
      }).catch(function(err) {
        console.log('Service worker registration failed, error:', err);
      });
    }
firebase.initializeApp({
    apiKey: "AIzaSyAAyugfzxeGnBYcqQhmFGG8QdbdV23BeM4",
    authDomain: "plms-d3fdd.firebaseapp.com",
    projectId: "plms-d3fdd",
    storageBucket: "plms-d3fdd.appspot.com",
    messagingSenderId: "28711992147",
    appId: "1:28711992147:web:91382ede1c8fcbec1abfa6"
  });

const initMessaging = firebase.messaging()