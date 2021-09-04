import firebase from 'firebase/app';
import "firebase/storage";
import fire from 'firebase';

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
  
  
  export   {fire};
  export default firebase;
