import * as firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMXD0-q5wcY-YxL0CuIS86ibvQEeGpp8c",
  authDomain: "eurovision-voter.firebaseapp.com",
  databaseURL: "https://eurovision-voter.firebaseio.com",
  projectId: "eurovision-voter",
  storageBucket: "eurovision-voter.appspot.com",
  messagingSenderId: "685398369353",
  appId: "1:685398369353:web:d9f10d520a5cf65a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
