import React from 'react';
import { render, waitFor, fireEvent, flushMicrotasksQueue } from '@testing-library/react-native';
import HomePanel from '../src/components/HomePanel';
import DocList from '../src/components/DocList';
import EditPanel from '../src/components/EditPanel';
import NewButton from '../src/components/NewButton';
import LogoutButton from '../src/components/LogoutButton';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import LoggedInContext from '../src/contexts/LoggedInContext';
import firestore from '@react-native-firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { act } from 'react-test-renderer';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';

import 'react-native-gesture-handler/jestSetup';
import { Button, Text } from 'react-native';

jest.mock('@react-native-firebase/firestore', () => jest.fn());
jest.mock('../src/components/DocList', () => jest.fn());
jest.mock('../src/components/EditPanel', () => jest.fn());
jest.mock('../src/components/NewButton', () => jest.fn());
jest.mock('../src/components/LogoutButton', () => jest.fn());

const userMock = { uid: 'user-id' } as FirebaseAuthTypes.User;
const firestoreMock = { collection: jest.fn() };
const firestoreCollectionMock = { doc: jest.fn() };
const docsCollectionMock = { collection: jest.fn() };
const docRefsMock = {};

beforeEach(() => {
    jest.resetAllMocks();
    (firestore as any as jest.Mock).mockReturnValue(firestoreMock);
    firestoreMock.collection.mockReturnValue(firestoreCollectionMock);
    firestoreCollectionMock.doc.mockReturnValue(docsCollectionMock);
    docsCollectionMock.collection.mockReturnValue(docRefsMock);
    (DocList as jest.Mock).mockReturnValue(null);
    (EditPanel as jest.Mock).mockReturnValue(null);
    (NewButton as jest.Mock).mockReturnValue(null);
    (LogoutButton as jest.Mock).mockReturnValue(null);
});

it('should render List screen', () => {
    render(
        <LoggedInContext.Provider value={{ user: userMock }}>
            <HomePanel />
        </LoggedInContext.Provider>
    );

    expect(firestore).toHaveBeenCalledWith();
    expect(firestoreMock.collection).toHaveBeenCalledWith('users');
    expect(firestoreCollectionMock.doc).toHaveBeenCalledWith(userMock.uid);
    expect(docsCollectionMock.collection).toHaveBeenCalledWith('docs');
    expect(DocList).toHaveBeenCalledWith(expect.objectContaining({ docRefs: docRefsMock }), {});
    expect(EditPanel).not.toHaveBeenCalled();
    expect(NewButton).toHaveBeenCalledWith({ docRefs: docRefsMock }, {});
    expect(LogoutButton).toHaveBeenCalledWith({}, {});
});

describe('when navigate to Edit', () => {

    it('should render Edit screen', () => {
        (DocList as jest.Mock).mockImplementation(props =>
            (<Button accessibilityLabel="Navigate button" title="Navigate" onPress={() => props.navigation.navigate('Edit')} />));

        const screen = render(
            <LoggedInContext.Provider value={{ user: userMock }}>
                <HomePanel />
            </LoggedInContext.Provider>
        );

        fireEvent.press(screen.getByA11yLabel('Navigate button'));

        expect(firestore).toHaveBeenCalledWith();
        expect(firestoreMock.collection).toHaveBeenCalledWith('users');
        expect(firestoreCollectionMock.doc).toHaveBeenCalledWith(userMock.uid);
        expect(docsCollectionMock.collection).toHaveBeenCalledWith('docs');

        expect(EditPanel).toHaveBeenCalledWith(expect.objectContaining({ docRefs: docRefsMock }), {});
    });
});