// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaoZ-WmRy_f3jEsKbYHR1G9SEMRPmR04c",
  authDomain: "niveshnow-afafa.firebaseapp.com",
  projectId: "niveshnow-afafa",
  storageBucket: "niveshnow-afafa.appspot.com",
  messagingSenderId: "117795127643",
  appId: "1:117795127643:web:7d5f2db2896726daeada7e",
  measurementId: "G-HHB28MM0FJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);