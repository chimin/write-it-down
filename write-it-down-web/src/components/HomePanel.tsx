import './HomePanel.css';

import firebase from 'firebase';
import React, { useContext, useMemo, useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import LoggedInContext from '../contexts/LoggedInContext';
import DeleteButton from './DeleteButton';
import DocList from './DocList';
import EditPanel from './EditPanel';
import NewButton from './NewButton';
import ProfilePanel from './ProfilePanel';

const HomePanel = () => {
    const loggedIn = useContext(LoggedInContext);
    const uid = loggedIn.user!.uid;
    const docRefs = useMemo(() => firebase.firestore().collection('users').doc(uid).collection('docs'), [uid]);
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const toggleMenu = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const closeMenu = () => {
        setSidebarVisible(false);
    };

    return (
        <BrowserRouter>
            <div className="content-panel">
                <Route path="/:id" children={<EditPanel docRefs={docRefs} />} />
            </div>
            <div className={'sidebar-mask  ' + (sidebarVisible ? 'visible' : '')} onClick={closeMenu}></div>
            <div className={'sidebar ' + (sidebarVisible ? 'visible' : '')}>
                <Route path="/:id?" children={<DocList docRefs={docRefs} onClickItem={closeMenu} />} />
            </div>
            <div className="topbar">
                <div className="container">
                    <div className="title">Write it down</div>
                    <button type="button" className="menu-button" onClick={toggleMenu}>Menu</button>
                    <div className="button-panel">
                        <NewButton docRefs={docRefs} />
                        <Route path="/:id" children={<DeleteButton docRefs={docRefs} />} />
                    </div>
                    <ProfilePanel />
                </div>
            </div>
        </BrowserRouter>
    );
};

export default HomePanel;