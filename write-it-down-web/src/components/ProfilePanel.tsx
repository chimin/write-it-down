import './ProfilePanel.css';

import React, { useContext } from 'react';

import LoggedInContext from '../contexts/LoggedInContext';

const ProfilePanel = () => {
    const loggedIn = useContext(LoggedInContext);

    return (
        <div className="profile-panel">
            <span className="greeting">Welcome, <span className="username">{loggedIn.user?.displayName}</span></span>
            <button type="button" onClick={loggedIn.clear}>Logout</button>
        </div>
    );
};

export default ProfilePanel;