// v9 compat packages are API compatible with v8 code
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';

var firebaseConfig = {
    apiKey: "AIzaSyAD1BbG_x1oR8LzhjcZioLaiEn4ULLpGc4",
    authDomain: "final-year-project-datab-3d5d4.firebaseapp.com",
    projectId: "final-year-project-datab-3d5d4",
    storageBucket: "final-year-project-datab-3d5d4.appspot.com",
    messagingSenderId: "1068142968031",
    appId: "1:1068142968031:web:d5653d95bf007c5b1b3d6a",
    measurementId: "G-FRQ87R3MY2"
};

const fire = firebase.initializeApp(firebaseConfig)
export const db = fire.database("https://final-year-project-datab-3d5d4-default-rtdb.europe-west1.firebasedatabase.app");
export const auth = fire.auth();

export default fire;
