import { useState, useEffect } from "react";

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyB1Rj0QutU-JwkAJ67R2nsrP5z1K2ciGVI",
    authDomain: "holodoos.firebaseapp.com",
    projectId: "holodoos",
    storageBucket: "holodoos.appspot.com",
    messagingSenderId: "281648364367",
    appId: "1:281648364367:web:07f5a2552a955fcc56633a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
}

export function useAuth() {
    const [ currentUser, setCurrentUser ] = useState();
    useEffect(() => {
       const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
       return unsub;
    }, [])
    return currentUser;
}

export function logout() {
    return signOut(auth);
}

export function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
}