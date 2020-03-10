import firebase from 'firebase';
// < !--The core Firebase JS SDK is always required and must be listed first-- >
//     <script src="https://www.gstatic.com/firebasejs/7.10.0/firebase-app.js"></script>

//     <!--TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries -->

// <script>
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBE8auObjMYjHy4DjuMxCbCJBZNSE8MKl8",
    authDomain: "haikyou-project-6.firebaseapp.com",
    databaseURL: "https://haikyou-project-6.firebaseio.com",
    projectId: "haikyou-project-6",
    storageBucket: "haikyou-project-6.appspot.com",
    messagingSenderId: "85831219483",
    appId: "1:85831219483:web:7d0848f2dc29dea534bbbe"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
// </script>

export default firebase;