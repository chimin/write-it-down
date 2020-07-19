import { render } from '@testing-library/react';
import firebase from 'firebase';
import React from 'react';

import App from './App';
import HomePanel from './components/HomePanel';
import LoginPanel from './components/LoginPanel';

jest.mock('firebase');
jest.mock('./components/LoginPanel', () => jest.fn());
jest.mock('./components/HomePanel', () => jest.fn());

const firebaseAuthMock = {
  onAuthStateChanged: jest.fn(),
};

beforeEach(() => {
  jest.resetAllMocks();
  (LoginPanel as jest.Mock).mockReturnValue(null);
  (HomePanel as jest.Mock).mockReturnValue(null);
  (firebase.auth as any as jest.Mock).mockReturnValue(firebaseAuthMock);
});

describe('when auth is not started', () => {

  it('should render nothing', () => {
    render(<App />);

    expect(firebase.auth).toHaveBeenCalled();
    expect(firebaseAuthMock.onAuthStateChanged).toHaveBeenCalledTimes(1);
    expect(LoginPanel).not.toHaveBeenCalled();
    expect(HomePanel).not.toHaveBeenCalled();
  });
});

describe('when user is not logged in', () => {

  it('should render LoginPanel', () => {
    firebaseAuthMock.onAuthStateChanged.mockImplementation((callback: (newUser: any) => void) => callback(null));
  
    render(<App />);
 
    expect(firebase.auth).toHaveBeenCalled();
    expect(firebaseAuthMock.onAuthStateChanged).toHaveBeenCalledTimes(1);
    expect(LoginPanel).toHaveBeenCalled();
    expect(HomePanel).not.toHaveBeenCalled();
  });
});

describe('when user is logged in', () => {

  it('should render HomePanel', () => {
    firebaseAuthMock.onAuthStateChanged.mockImplementation((callback: (newUser: any) => void) => callback({}));
   
    render(<App />);
    
    expect(firebase.auth).toHaveBeenCalled();
    expect(firebaseAuthMock.onAuthStateChanged).toHaveBeenCalledTimes(1);
    expect(LoginPanel).not.toHaveBeenCalled();
    expect(HomePanel).toHaveBeenCalled();
  });
});