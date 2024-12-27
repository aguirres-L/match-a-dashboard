// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3Cn9e9j8iOx6RNQoYfCVUOpLXJmNKPPI",
  authDomain: "verdu-shop.firebaseapp.com",
  projectId: "verdu-shop",
  storageBucket: "verdu-shop.appspot.com",
  messagingSenderId: "188984786995",
  appId: "1:188984786995:web:5c6ce0dd1e82975d1da346"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and get a reference to the service
const db = getFirestore(app);

// Function to get users from the "user" collection
export async function getUsers() {
  const userCollection = collection(db, "user-beaute");
  const userSnapshot = await getDocs(userCollection);
  const userList = userSnapshot.docs.map(doc => doc.data());

  return userList;
}
