// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUb7MQRvbsPv61BqAuXW7tvVSnpIoO-rg",
  authDomain: "nit-goa-28558.firebaseapp.com",
  projectId: "nit-goa-28558",
  storageBucket: "nit-goa-28558.firebasestorage.app",
  messagingSenderId: "64833975558",
  appId: "1:64833975558:web:6bb452c8953167ff991a87",
  measurementId: "G-L71MQYVNWF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);