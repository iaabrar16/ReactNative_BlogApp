import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDkdC6hQOSSlMMBh8qSPxE9bps658rPq68",
    authDomain: "blogapp-f93b7.firebaseapp.com",
    projectId: "blogapp-f93b7",
    storageBucket: "blogapp-f93b7.appspot.com",
    messagingSenderId: "992636687895",
    appId: "1:992636687895:web:e1129016d981f92381ee52",
    measurementId: "G-L6ZR9RR6DE"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
const firestore = getFirestore(app);
const storage = getStorage(app);

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}
export { firebase, auth, firestore, storage, app, ref };