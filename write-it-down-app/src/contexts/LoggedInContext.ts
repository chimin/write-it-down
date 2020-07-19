import React from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

const LoggedInContext = React.createContext<Partial<{
    user: FirebaseAuthTypes.User | null,
    clear: () => Promise<void>,
}>>({});

export default LoggedInContext;
