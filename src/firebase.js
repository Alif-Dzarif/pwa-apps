// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getDocs, collection, getFirestore, addDoc, updateDoc, deleteDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"

// TODO: Add SDKs for Firebase products that you want to use
const firebaseConfig = {
  apiKey: "AIzaSyDteHUwQjyh4HpeYCorRXAelDN3DvE87Yk",
  authDomain: "products-dummy-database.firebaseapp.com",
  projectId: "products-dummy-database",
  storageBucket: "products-dummy-database.appspot.com",
  messagingSenderId: "671443584769",
  appId: "1:671443584769:web:a1576fe72986ee24c9bd00",
  measurementId: "G-10Y3EPJPK9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const docRef = collection(db, "products");

// Global variables
let productId;

// Read
const docSnap = await getDocs(docRef);

if (docSnap) {
  docSnap.forEach(product => {
    const markup = `
            <div class="card_box">
              <figure><img src="${product.data().image}" alt="Shoes" /></figure>
              <div class="card_body">
                <h2>${product.data().name}</h2>
                  <p>${product.data().description}</p>
                  <div class="card_actions">
                    <div class="card_interact">
                      <button onclick="edit_modal.showModal()" id="edit_${product.id}">EDIT</button>
                      <button id="delete_${product.id}">DELETE</button>
                    </div>
                    <button>$${product.data().price} USD</button>
                  </div>
              </div>
            </div>
          `;

    document.querySelector('#product__list').insertAdjacentHTML('beforeend', markup);

    document.getElementById(`edit_${product.id}`).addEventListener('click', function () {
      productId = product.id;
    });

    // Delete
    document.getElementById(`delete_${product.id}`).addEventListener('click', async () => {
      await deleteDoc(doc(db, "products", product.id));
      window.location.reload();
    });
  })
} else {
  console.log("No such document!");
}

// Create
const addButton = document.querySelector('.add-submit');

addButton.addEventListener("click", async (e) => {
  const nameVal = document.getElementById("product_name").value;
  const descriptionVal = document.getElementById("product_description").value;
  const priceVal = document.getElementById("product_price").value;
  const imageVal = document.getElementById("product_image").value;

  if (window.navigator.onLine) {
    if (nameVal.length > 0 && descriptionVal.length > 0 && priceVal.length > 0 && imageVal.length > 0) {
      await addDoc(collection(db, "products"), {
        name: nameVal,
        description: descriptionVal,
        price: priceVal,
        image: imageVal
      });

      window.location.reload();
    } else {
      localStorage.removeItem("productId");
    }
  } else {
    if (nameVal.length > 1) {
      localStorage.productName = nameVal
    }

    if (descriptionVal.length > 1) {
      localStorage.productDescription = descriptionVal
    }

    if (priceVal.length > 1) {
      localStorage.productPrice = priceVal
    }

    if (imageVal.length > 1) {
      localStorage.productImage = imageVal
    }
  }
});


// Update
const editButton = document.querySelector('.edit-submit');

editButton.addEventListener("click", async () => {
  let option = {};
  const nameVal = document.getElementById("edit_name").value;
  const descriptionVal = document.getElementById("edit_description").value;
  const priceVal = document.getElementById("edit_price").value;
  const imageVal = document.getElementById("edit_image").value;

  if (window.navigator.onLine) {
    if (nameVal.length > 1) option.name = nameVal
    if (descriptionVal.length > 1) option.description = descriptionVal
    if (priceVal.length > 1) option.price = priceVal
    if (imageVal.length > 1) option.image = imageVal

    if (nameVal.length > 0 || descriptionVal.length > 0 || priceVal.length > 0 || imageVal.length > 0) {
      await updateDoc(doc(db, "products", productId), option);
      localStorage.removeItem("productId");
      window.location.reload();
    } else {
      productId = null;
    }
  } else {
    let updateArr = [];
    let option = {};

    if (nameVal.length > 0 || descriptionVal.length > 0 || priceVal.length > 0 || imageVal.length > 0) {
      if (nameVal.length > 1) option.productName = nameVal
      if (descriptionVal.length > 1) option.productDescription = descriptionVal
      if (priceVal.length > 1) option.productPrice = priceVal
      if (imageVal.length > 1) option.productImage = imageVal

      if (productId) {
        option.productId = productId;
        updateArr.push(option)

        if (localStorage.editProductQueue) {
          const localArr = JSON.parse(localStorage.editProductQueue);
          localArr.push(option);
          localStorage.editProductQueue = JSON.stringify(localArr)
        } else {
          localStorage.editProductQueue = JSON.stringify(updateArr)
        }
        option = {};
      } else {
        option = {};
      }
    } else {
      productId = null;
    }
  }
})