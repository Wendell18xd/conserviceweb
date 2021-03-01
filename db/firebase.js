
//Your web app's Firebase configuration

var firebaseConfig = {
    apiKey: "AIzaSyDVeNlVtw1iNFnBhapqtrj31XTwJvThCME",
    authDomain: "ticprint.firebaseapp.com",
    projectId: "ticprint",
    storageBucket: "gs://ticprint.appspot.com/",
    messagingSenderId: "772378627398",
    appId: "1:772378627398:web:2d1f429b4bcfee6b80e947"
};


/*var firebaseConfig = {
    apiKey: "AIzaSyCDmZ1_Lyq1aFm8KoPUM4vjlVoy0PUOhKA",
    authDomain: "respaldotic.firebaseapp.com",
    projectId: "respaldotic",
    storageBucket: "gs://respaldotic.appspot.com/",
    messagingSenderId: "749573896119",
    appId: "1:749573896119:web:dd320689131ab1d150da32"
  };*/

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

storage = firebase.storage();

// inicialisar db
const db = firebase.firestore();
const auth = firebase.auth();