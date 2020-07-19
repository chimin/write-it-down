import './App.css';

import firebase from 'firebase';
import React, { useEffect, useState } from 'react';

import HomePanel from './components/HomePanel';
import LoginPanel from './components/LoginPanel';
import LoggedInContext from './contexts/LoggedInContext';

firebase.initializeApp({
  apiKey: "AIzaSyDUh-vwyfsy2sRh_feLkw76jQrlY8A4mt4",
  authDomain: "c4compile-276001.firebaseapp.com",
  databaseURL: "https://c4compile-276001.firebaseio.com",
  projectId: "c4compile-276001",
  storageBucket: "c4compile-276001.appspot.com",
  messagingSenderId: "201805209772",
  appId: "1:201805209772:web:e2eaee8bbf6a139b83ff09",
  measurementId: "G-N54MS059RC"
});

const App = () => {
  const auth = firebase.auth();
  const [user, setUser] = useState<firebase.User | null>();

  const logout = async () => {
    await auth.signOut();
  };

  useEffect(() => {
    return auth.onAuthStateChanged(newUser => setUser(newUser));
  }, [auth]);

  return (
    <LoggedInContext.Provider value={{ user, clear: logout }}>
      {user === undefined ? null : user ? <HomePanel /> : <LoginPanel />}
    </LoggedInContext.Provider>
  );
};

export default App;
