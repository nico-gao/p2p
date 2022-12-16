import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCW5hu6JqIFVQIlypFHlo4W2tYreEfloDk",
  authDomain: "webrtc-61982.firebaseapp.com",
  projectId: "webrtc-61982",
  storageBucket: "webrtc-61982.appspot.com",
  messagingSenderId: "364496757601",
  appId: "1:364496757601:web:1e9a900494821845f85b20",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
