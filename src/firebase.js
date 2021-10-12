import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCapu90FUXvumvpm0iZSGP7kikd3tadm_8",
  authDomain: "onlinechessproj.firebaseapp.com",
  projectId: "onlinechessproj",
  storageBucket: "onlinechessproj.appspot.com",
  messagingSenderId: "748298729141",
  appId: "1:748298729141:web:a0c4721a66c1dd2b47f0fc"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export const auth = firebase.auth();

export default firebase;