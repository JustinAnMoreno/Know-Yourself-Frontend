//TODO: import the firebase core module
import firebase from "firebase/app";
//TODO: import the auth package from firebase
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBBYSvHr2j-8fiyR1Zs4vaKbK3olrpyTGY",
    authDomain: "know-yourself-a67b5.firebaseapp.com",
    projectId: "know-yourself-a67b5",
    storageBucket: "know-yourself-a67b5.appspot.com",
    messagingSenderId: "128453635164",
    appId: "1:128453635164:web:6d7469db72dfeb27964a99"
  };


//TODO: initialize the firebase app
firebase.initializeApp(firebaseConfig);

//TODO: set up a firebase provider 
const googleProvider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

//TODO: configure the firebase provider
function login() {
    auth.signInWithPopup(googleProvider);
};
//TODO: set up with auth actions i.e login, logout etc
function logout() {
    auth.signOut();
};

//TODO: export actions 
export {
    auth,
    login,
    logout,
}