import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAhp4nFMQQJokswCLlpUzYylaEulZHrPZs",
    authDomain: "itd112lab2mangoda-bd363.firebaseapp.com",
    projectId: "itd112lab2mangoda-bd363",
    storageBucket: "itd112lab2mangoda-bd363.appspot.com",
    messagingSenderId: "400095628461",
    appId: "1:400095628461:web:3f654d44dd21e379e3ca24",
    measurementId: "G-DKDN65QHD9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

export { db, collection,  getDocs};
