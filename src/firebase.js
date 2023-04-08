 import { getAuth } from 'firebase/auth';
 import firebase from 'firebase/compat/app';
 import 'firebase/compat/firestore';


 firebase.initializeApp( {
     apiKey: "AIzaSyCVaN2HBFC0Grt-am83NDV7214234nlh4I",
     authDomain: "netflix-clone-bb40a.firebaseapp.com",
     projectId: "netflix-clone-bb40a",
     storageBucket: "netflix-clone-bb40a.appspot.com",
     messagingSenderId: "543691630393",
     appId: "1:543691630393:web:c1a42ad1d1f524c336eae8"
   });

   const auth = getAuth();
   const db = firebase.firestore();

 export  {auth} ;
 export default db;

