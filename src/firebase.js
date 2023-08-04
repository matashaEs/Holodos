import { initializeApp } from "firebase/app";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzBpLw92mjxSORcjALc2UPgBQpnsUy8Ek",
  authDomain: "holodos-db.firebaseapp.com",
  projectId: "holodos-db",
  storageBucket: "holodos-db.appspot.com",
  messagingSenderId: "283695988171",
  appId: "1:283695988171:web:d7be8097ed878614904a4e",
  measurementId: "G-4YQLYPK8JH"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    return err;
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;

  try {
    await setDoc(doc(db, "users", user.uid), {
      uId: user.uid,
      name,
      email,
      password,
    });
    const q = query(collection(db, "users"), where("uId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {

      // await addDoc(collection(db, `users/${doc.id}/products`), {
      //   name: "",
      //   unit: "",
      // });
    });
  } catch (err) {
    return err;
  }
};

const searchByProducts = async (product, item) => {
  let allData = [];
  let numberOfMathces = [];
  try {
    let i = 1;
    const q = query(collection(db, `recipes/${item}/ingredients`), where("name", "==", product));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docRecipe) => {
      allData[item] = {
        "sort": i,
      };
      i++;
    });
    if (allData[item]) {
      numberOfMathces[item] = allData[item];
    }
    return numberOfMathces;
  } catch (error) {
    console.log(error);
  }
}

const getUserId = async (user) => {
  let allData = {};
  try {
    const colRef = collection(db, `users/${user.uid}/favoriteRecipes`);
    const docs = await getDocs(colRef);
    docs.forEach((doc) => {
      allData[doc.id] = doc.data();
    });
    return allData;
  } catch (error) {
    console.log(error);
  }
}

const getUser = async (user) => {
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data().name;
}

const addCommentText = async (comment, user, recipe) => {
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  try {
    await addDoc(collection(db, `recipes/${recipe}/comments`), {
      comment: comment,
      userName: docSnap.data().name,
      date: new Date(),
    });
  } catch (err) {
    return err;
  }
}

const addNewProduct = async (user, name, image, unit) => {
  const colRef = collection(db, `users/${user.uid}/products`);
  let docExsist = false;
  try {
    const docs = await getDocs(colRef);
    docs.forEach(async (docum) => {
      if (docum.data().name === name) {
        docExsist = true;
        const washingtonRef = doc(db, `users/${user.uid}/products/${docum.id}`);
        const newUnit = parseInt(docum.data().unit) + parseInt(unit);
        await updateDoc(washingtonRef, {
          unit: newUnit.toString(),
        });
      }
    });
    if (docExsist != true) {
      await addDoc(collection(db, `users/${user.uid}/products`), {
        name: name,
        unit: unit,
        imageUri: image,
      });
    }
  } catch (err) {
    return err;
  }
}

const deleteUsProduct = async (user, id) => {
  try {
    await deleteDoc(doc(db, `users/${user.uid}/products/${id}`));
  } catch (err) {
    return err;
  }
}

const favorites = async (user, recept) => {
  const colRef = doc(db, 'recipes', recept);
  try {
    const recipe = await getDoc(colRef);
    const q = query(collection(db, "users"), where("uId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (docUser) => {
      const ifRecipeExist = query(collection(db, `users/${docUser.id}/favoriteRecipes`),
        where("name", "==", recipe.data().name))
      const docSnap = await getDocs(ifRecipeExist);
      if (!docSnap.empty) {
        docSnap.forEach(async (docRecipe) => {
          await deleteDoc(doc(db, `users/${docUser.id}/favoriteRecipes/${docRecipe.id}`));
        });
      } else {
        await setDoc(doc(db, `users/${docUser.id}/favoriteRecipes`, recept), {
          name: recipe.data().name,
          imgUri: recipe.data().imgUri,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    return err;
  }
};

const getAllData = async (dbName) => {
  const allData = {};
  const colRef = collection(db, dbName);
  try {
    const docs = await getDocs(colRef);
    docs.forEach((doc) => {
      allData[doc.id] = doc.data();
    });
    return allData;
  } catch (error) {
    console.log(error);
  }
}

const getDocData = async (dbName, docId) => {
  const colRef = doc(db, dbName, docId);
  try {
    const doc = await getDoc(colRef);
    return doc.data();
  } catch (error) {
    console.log(error);
  }
}

const filter = async (name, action, value) => {
  const allData = {};
  const colRef = collection(db, "recipes");
  const q = query(colRef, where(name, action, value));
  try {
    const docs = await getDocs(q);
    docs.forEach((doc) => {
      allData[doc.id] = doc.data();
    });
    return allData;
  } catch (error) {
    console.log(error);
  }
}

const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getAllData,
  getDocData,
  filter,
  favorites,
  getUserId,
  searchByProducts,
  addCommentText,
  addNewProduct,
  getUser,
  deleteUsProduct,
};