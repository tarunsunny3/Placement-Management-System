importScripts('https://www.gstatic.com/firebasejs/6.6.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.6.2/firebase-messaging.js');


firebase.initializeApp({
    messagingSenderId: "28711992147"
});

const initMessaging = firebase.messaging()
