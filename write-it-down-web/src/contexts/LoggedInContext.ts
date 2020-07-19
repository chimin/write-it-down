import firebase from 'firebase';
import React from 'react';

const LoggedInContext = React.createContext<Partial<{
    user: firebase.User | null,
    clear: () => Promise<void>,
}>>({});

export default LoggedInContext;