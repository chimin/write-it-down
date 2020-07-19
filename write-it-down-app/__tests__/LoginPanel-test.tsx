import React from 'react';
import { render, RenderAPI, fireEvent, waitFor } from '@testing-library/react-native';
import LoginPanel from '../src/components/LoginPanel';
import { GoogleSigninButton, GoogleSignin } from '@react-native-community/google-signin';
import { Text } from 'react-native';
import auth from '@react-native-firebase/auth';

jest.mock('react-native', () => Object.setPrototypeOf(
    {
        NativeModules: {
            RNGoogleSignin: {},
        },
    },
    jest.requireActual('react-native'))
);
jest.mock('@react-native-community/google-signin');
jest.mock('@react-native-firebase/auth', () => jest.fn());

const userMock = { idToken: 'id-token' };
const authMock = {
    signInWithCredential: jest.fn(),
};
const credentialMock = {};

auth.GoogleAuthProvider = {
    credential: jest.fn(),
} as any;

beforeEach(() => {
    jest.resetAllMocks();
    (GoogleSignin.signIn as jest.Mock).mockResolvedValue(userMock);
    (auth as any as jest.Mock).mockReturnValue(authMock);
    (auth.GoogleAuthProvider.credential as jest.Mock).mockReturnValue(credentialMock);
});

it('should render the title and the Google sign in button', () => {
    const screen = render(<LoginPanel />);
    getTitleText(screen);
    getGoogleSigninButton(screen);

    expect(GoogleSignin.hasPlayServices).not.toHaveBeenCalled();
    expect(GoogleSignin.signIn).not.toHaveBeenCalled();
    expect(auth).not.toHaveBeenCalled();
    expect(auth.GoogleAuthProvider.credential).not.toHaveBeenCalled();
    expect(authMock.signInWithCredential).not.toHaveBeenCalled();
});

describe('when click the Google sign in button', () => {

    it('should call login', async () => {
        const screen = render(<LoginPanel />);
        fireEvent.press(getGoogleSigninButton(screen));

        expect(GoogleSignin.hasPlayServices).toHaveBeenCalledWith();
        await waitFor(() => {
            expect(GoogleSignin.signIn).toHaveBeenCalledWith();
        });
        expect(auth).toHaveBeenCalledWith();
        expect(auth.GoogleAuthProvider.credential).toHaveBeenCalledWith(userMock.idToken);
        expect(authMock.signInWithCredential).toHaveBeenCalledWith(credentialMock);
    });
});

function getTitleText(screen: RenderAPI) {
    return screen.getByA11yLabel('Title text');
}

function getGoogleSigninButton(screen: RenderAPI) {
    return screen.UNSAFE_getByType(GoogleSigninButton);
}
