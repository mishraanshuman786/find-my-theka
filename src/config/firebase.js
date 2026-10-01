import { initializeApp } from "firebase/app";
import {  initializeAuth,
  getReactNativePersistence, } from "firebase/auth";
  import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyBvFbxtkgXE7D2gab2vipetE7Dw9mPwNDI",
  authDomain: "find-my-theka.firebaseapp.com",
  projectId: "find-my-theka",
  storageBucket: "find-my-theka.firebasestorage.app",
  messagingSenderId: "1032768433679",
  appId: "1:1032768433679:web:4df5d50bfebd92788e7d7a"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});


export default app;