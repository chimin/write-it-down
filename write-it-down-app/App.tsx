import React, { useEffect, useState } from 'react';
import LoginPanel from './src/components/LoginPanel';
import HomePanel from './src/components/HomePanel';
import LoggedInContext from './src/contexts/LoggedInContext';
import { GoogleSignin } from '@react-native-community/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

const App = () => {
  const firebaseAuth = auth();
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  const logout = async () => {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    await firebaseAuth.signOut();
  };

  useEffect(() => {
    return firebaseAuth.onAuthStateChanged((newUser) => setUser(newUser));
  }, [firebaseAuth]);

  return (
    <LoggedInContext.Provider value={{ user, clear: logout }}>
      {user === undefined ? null : user ? <HomePanel /> : <LoginPanel />}
    </LoggedInContext.Provider>
  );
};

export default App;
