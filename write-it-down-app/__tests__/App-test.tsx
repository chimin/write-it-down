/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

import auth from '@react-native-firebase/auth';
import LoginPanel from '../src/components/LoginPanel';
import HomePanel from '../src/components/HomePanel';
import { render } from '@testing-library/react-native';

jest.mock('../src/components/LoginPanel', () => jest.fn());
jest.mock('../src/components/HomePanel', () => jest.fn());
jest.mock('@react-native-community/google-signin', () => ({
  GoogleSignin: {
    revokeAccess: jest.fn(),
    signOut: jest.fn(),
  },
}));
jest.mock('@react-native-firebase/auth', () => jest.fn());

const firebaseAuthMock = {
  onAuthStateChanged: jest.fn(),
};

beforeEach(() => {
  jest.resetAllMocks();
  (LoginPanel as jest.Mock).mockReturnValue(null);
  (HomePanel as jest.Mock).mockReturnValue(null);
  (auth as any as jest.Mock).mockReturnValue(firebaseAuthMock);
});

describe('when auth is not started', () => {

  it('should render nothing', () => {
    render(<App />);

    expect(auth).toHaveBeenCalledWith();
    expect(firebaseAuthMock.onAuthStateChanged).toHaveBeenCalledTimes(1);
    expect(LoginPanel).not.toHaveBeenCalled();
    expect(HomePanel).not.toHaveBeenCalled();
  });
});


describe('when user is not logged in', () => {

  it('should render LoginPanel', () => {
    firebaseAuthMock.onAuthStateChanged.mockImplementation((callback: (newUser: any) => void) => callback(null));
  
    render(<App />);
 
    expect(auth).toHaveBeenCalled();
    expect(firebaseAuthMock.onAuthStateChanged).toHaveBeenCalledTimes(1);
    expect(LoginPanel).toHaveBeenCalled();
    expect(HomePanel).not.toHaveBeenCalled();
  });
});

describe('when user is logged in', () => {

  it('should render HomePanel', () => {
    firebaseAuthMock.onAuthStateChanged.mockImplementation((callback: (newUser: any) => void) => callback({}));
   
    render(<App />);
    
    expect(auth).toHaveBeenCalled();
    expect(firebaseAuthMock.onAuthStateChanged).toHaveBeenCalledTimes(1);
    expect(LoginPanel).not.toHaveBeenCalled();
    expect(HomePanel).toHaveBeenCalled();
  });
});
