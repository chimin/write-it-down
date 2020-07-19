import './LoginPanel.css';
import '../../node_modules/firebaseui/dist/firebaseui.css';

import firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import React, { useEffect, useRef } from 'react';

let uiPromise = Promise.resolve<firebaseui.auth.AuthUI | null>(null);

const LoginPanel = () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        uiPromise = uiPromise.then(() => {
            const ui = new firebaseui.auth.AuthUI(firebase.auth());
            ui.start(ref.current!, {
                signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
                signInFlow: 'popup',
                callbacks: { signInSuccessWithAuthResult: () => false }
            });
            return ui;
        });
        return () => { uiPromise = uiPromise.then(ui => ui!.delete()).then(() => null) };
    });

    return (
        <div className="login-panel">
            <h1>Write it down</h1>
            <div ref={ref}></div>
        </div>
    );
};

export default LoginPanel;