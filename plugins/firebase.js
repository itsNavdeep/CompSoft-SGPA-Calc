import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfiguration = {
  apiKey: "AIzaSyA0354p0txZSZ-aPvp9RvsaLR5LFtNhGW8",
  authDomain: "compsoft-gpa-calc-207d7.firebaseapp.com",
  projectId: "compsoft-gpa-calc-207d7",
  storageBucket: "compsoft-gpa-calc-207d7.appspot.com",
  messagingSenderId: "229545567517",
  appId: "1:229545567517:web:bb8242236ff0ff9108edf4"
}

let app ;
const Apps = getApps();
if(!Apps.length){
  app = initializeApp(firebaseConfiguration);
}else {
  app = Apps[0];
}

export const Authenticator = getAuth(app, {});
export const Database = getFirestore(app, {});
