// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";


// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaj8SGYGvXxo8WjsK5eNzmLImKxdDyE30",
  authDomain: "car-project-b8e4e.firebaseapp.com",
  projectId: "car-project-b8e4e",
  storageBucket: "car-project-b8e4e.firebasestorage.app",
  messagingSenderId: "924157968633",
  appId: "1:924157968633:web:b34ae7c999bee541286228",
  measurementId: "G-E75CHBMXWV"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Storage
const storage = getStorage(app);

export { storage };