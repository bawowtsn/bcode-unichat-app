import firebase from "firebase/app";
import "firebase/auth";


export const auth =  firebase.initializeApp({
    apiKey: "AIzaSyALoIgXQzA8LoumrynAdxZJmtUMrdyYBVs",
    authDomain: "b-unichat.firebaseapp.com",
    projectId: "b-unichat",
    storageBucket: "b-unichat.appspot.com",
    messagingSenderId: "61575736261",
    appId: "1:61575736261:web:a6ce287f8463ab846279ac"
  }).auth();