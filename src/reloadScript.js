import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDocs, collection, getFirestore, addDoc, updateDoc, deleteDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyDteHUwQjyh4HpeYCorRXAelDN3DvE87Yk",
  authDomain: "products-dummy-database.firebaseapp.com",
  projectId: "products-dummy-database",
  storageBucket: "products-dummy-database.appspot.com",
  messagingSenderId: "671443584769",
  appId: "1:671443584769:web:a1576fe72986ee24c9bd00",
  measurementId: "G-10Y3EPJPK9"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

window.onload = async () => {
  if (window.navigator.onLine) {
    if (localStorage.editProductQueue) {

      const arrQueue = JSON.parse(localStorage.editProductQueue);

      arrQueue.map(async (item) => {
        const option = {};

        if (item.productName) option.name = item.productName;
        if (item.productDescription) option.description = item.productDescription;
        if (item.productPrice) option.price = item.productPrice;
        if (item.productImage) option.image = item.productImage;

        await updateDoc(doc(db, "products", item.productId), option);
      })

      localStorage.clear();
    } else {
      if (localStorage.productName && localStorage.productDescription && localStorage.productPrice && localStorage.productImage) {
        await addDoc(collection(db, "products"), {
          name: localStorage.productName,
          description: localStorage.productDescription,
          price: localStorage.productPrice,
          image: localStorage.productImage
        });

        localStorage.clear();
      }
    }
  }
}
