import React from 'react';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { RouteProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { render, RenderAPI, fireEvent } from '@testing-library/react-native';
import EditPanel from '../src/components/EditPanel';
import DeleteButton from '../src/components/DeleteButton';
import LogoutButton from '../src/components/LogoutButton';

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
}));
jest.mock('../src/components/DeleteButton', () => jest.fn());
jest.mock('../src/components/LogoutButton', () => jest.fn());

const docRefsMock = { doc: jest.fn() } as any as FirebaseFirestoreTypes.CollectionReference;
const docRefMock = {
    set: jest.fn(),
    onSnapshot: jest.fn(),
};
const docOnSnapshotUnsubscribeMock = jest.fn();
const docId = 'doc-id';
const routeMock = { params: { id: docId } } as RouteProp<ParamListBase, string>;
const logoutMock = jest.fn();
const navigationMock = {
    navigate: jest.fn(),
    setOptions: jest.fn(),
};

beforeEach(() => {
    jest.resetAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(navigationMock);
    (docRefsMock.doc as jest.Mock).mockReturnValue(docRefMock);
    docRefMock.onSnapshot.mockReturnValue(docOnSnapshotUnsubscribeMock);
    (DeleteButton as jest.Mock).mockReturnValue(null);
    (LogoutButton as jest.Mock).mockReturnValue(null);
});

it('should render an editor', () => {
    const screen = render(
        <EditPanel docRefs={docRefsMock} route={routeMock} logout={logoutMock} />
    );
    getEditor(screen);

    expect(useNavigation).toHaveBeenCalledWith();
    expect(docRefsMock.doc).toHaveBeenCalledWith(docId);
    expect(navigationMock.navigate).not.toHaveBeenCalled();
    expect(docRefMock.set).not.toHaveBeenCalled();
    expect(navigationMock.setOptions).toHaveBeenCalledWith({
        headerTitle: 'Write it down',
        headerLeft: expect.any(Function),
        headerRight: expect.any(Function),
    });
    expect(docRefMock.onSnapshot).toHaveBeenCalledWith(expect.any(Function));
    expect(docOnSnapshotUnsubscribeMock).not.toHaveBeenCalled();
    expect(DeleteButton).not.toHaveBeenCalled();
    expect(LogoutButton).not.toHaveBeenCalled();
    expect(getEditor(screen).props.value).toBe('');
});

describe('when unmount', () => {

    it('should unsubscribe events', () => {
        const screen = render(
            <EditPanel docRefs={docRefsMock} route={routeMock} logout={logoutMock} />
        );
        screen.unmount();

        expect(docOnSnapshotUnsubscribeMock).toHaveBeenCalledWith();
    });
});

describe('when editor test changed', () => {

    it('should update the content', () => {
        const newTitle = 'new title';
        const newContent = `${newTitle}\nnew content\nline 2`;
        const screen = render(
            <EditPanel docRefs={docRefsMock} route={routeMock} logout={logoutMock} />
        );
        fireEvent.changeText(getEditor(screen), newContent);

        expect(useNavigation).toHaveBeenCalledWith();
        expect(docRefsMock.doc).toHaveBeenCalledWith(docId);
        expect(navigationMock.navigate).not.toHaveBeenCalled();
        expect(docRefMock.set).toHaveBeenCalledWith({
            title: newTitle,
            content: newContent,
        });
        expect(navigationMock.setOptions).toHaveBeenCalledWith({
            headerTitle: 'Write it down',
            headerLeft: expect.any(Function),
            headerRight: expect.any(Function),
        });
        expect(docRefMock.onSnapshot).toHaveBeenCalledWith(expect.any(Function));
        expect(docOnSnapshotUnsubscribeMock).not.toHaveBeenCalled();
        expect(DeleteButton).not.toHaveBeenCalled();
        expect(LogoutButton).not.toHaveBeenCalled();
        expect(getEditor(screen).props.value).toBe(newContent);
    });
});

describe('when the snapshot event is emitted', () => {

    describe('when the document has pending writes', () => {

        it('should update the content', () => {
            const docDataMock = { content: 'doc-content' };
            const docMock = {
                metadata: { hasPendingWrites: true },
                data: jest.fn().mockReturnValue(docDataMock),
            } as any as FirebaseFirestoreTypes.DocumentSnapshot;
            docRefMock.onSnapshot.mockImplementation((callback: (doc: FirebaseFirestoreTypes.DocumentSnapshot) => void) => {
                callback(docMock);
            });

            const screen = render(
                <EditPanel docRefs={docRefsMock} route={routeMock} logout={logoutMock} />
            );

            expect(useNavigation).toHaveBeenCalledWith();
            expect(docRefsMock.doc).toHaveBeenCalledWith(docId);
            expect(navigationMock.navigate).not.toHaveBeenCalled();
            expect(docRefMock.set).not.toHaveBeenCalled();
            expect(navigationMock.setOptions).toHaveBeenCalledWith({
                headerTitle: 'Write it down',
                headerLeft: expect.any(Function),
                headerRight: expect.any(Function),
            });
            expect(docRefMock.onSnapshot).toHaveBeenCalledWith(expect.any(Function));
            expect(docOnSnapshotUnsubscribeMock).not.toHaveBeenCalled();
            expect(DeleteButton).not.toHaveBeenCalled();
            expect(LogoutButton).not.toHaveBeenCalled();
            expect(getEditor(screen).props.value).toBe('');

            expect(docMock.data).not.toHaveBeenCalled();
        });
    });
    describe('when the document has NO pending writes', () => {

        it('should update the content', () => {
            const docDataMock = { content: 'doc-content' };
            const docMock = {
                metadata: { hasPendingWrites: false },
                data: jest.fn().mockReturnValue(docDataMock),
            } as any as FirebaseFirestoreTypes.DocumentSnapshot;
            docRefMock.onSnapshot.mockImplementation((callback: (doc: FirebaseFirestoreTypes.DocumentSnapshot) => void) => {
                callback(docMock);
            });

            const screen = render(
                <EditPanel docRefs={docRefsMock} route={routeMock} logout={logoutMock} />
            );

            expect(useNavigation).toHaveBeenCalledWith();
            expect(docRefsMock.doc).toHaveBeenCalledWith(docId);
            expect(navigationMock.navigate).not.toHaveBeenCalled();
            expect(docRefMock.set).not.toHaveBeenCalled();
            expect(navigationMock.setOptions).toHaveBeenCalledWith({
                headerTitle: 'Write it down',
                headerLeft: expect.any(Function),
                headerRight: expect.any(Function),
            });
            expect(docRefMock.onSnapshot).toHaveBeenCalledWith(expect.any(Function));
            expect(docOnSnapshotUnsubscribeMock).not.toHaveBeenCalled();
            expect(DeleteButton).not.toHaveBeenCalled();
            expect(LogoutButton).not.toHaveBeenCalled();
            expect(getEditor(screen).props.value).toBe(docDataMock.content);

            expect(docMock.data).toHaveBeenCalledWith();
        });
    });
});

function getEditor(screen: RenderAPI) {
    return screen.getByA11yLabel('Editor');
}
