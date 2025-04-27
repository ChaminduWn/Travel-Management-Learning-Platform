// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlj8LWgIUJi7foLVK6z-AhQOzgB7k-UOI",
  authDomain: "travelz-5c2c4.firebaseapp.com",
  projectId: "travelz-5c2c4",
  storageBucket: "travelz-5c2c4.firebasestorage.app",
  messagingSenderId: "543299886638",
  appId: "1:543299886638:web:33bd450e5e9e74bceb49bf",
  measurementId: "G-6BLZ9Z2Q7L"
};

// Initialize Firebase
// const analytics = getAnalytics(app);
export const app = initializeApp(firebaseConfig);
