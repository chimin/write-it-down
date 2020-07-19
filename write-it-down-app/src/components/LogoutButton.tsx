import React, { useContext } from 'react';
import LoggedInContext from '../contexts/LoggedInContext';
import { Button } from 'react-native';

const LogoutButton = () => {
    const loggedIn = useContext(LoggedInContext);

    const logout = () => {
        loggedIn.clear?.apply(null);
    };

    return (<Button accessibilityLabel="Logout button" title="Logout" onPress={logout} />);
};

export default LogoutButton;
