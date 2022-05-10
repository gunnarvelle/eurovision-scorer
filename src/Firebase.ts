import * as firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAyiPwsV5KhuJBve4i9Ci4qcXyB9fc5XQs",
  authDomain: "esc-voter.firebaseapp.com",
  databaseURL: "https://esc-voter.firebaseio.com",
  projectId: "esc-voter",
  storageBucket: "esc-voter.appspot.com",
  messagingSenderId: "124189722667",
  appId: "1:124189722667:web:86ccdcbd1414565558826e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
