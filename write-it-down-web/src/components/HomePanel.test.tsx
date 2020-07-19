import { fireEvent, render, screen } from '@testing-library/react';
import firebase from 'firebase';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

import LoggedInContext from '../contexts/LoggedInContext';
import DeleteButton from './DeleteButton';
import DocList from './DocList';
import EditPanel from './EditPanel';
import HomePanel from './HomePanel';
import NewButton from './NewButton';
import ProfilePanel from './ProfilePanel';

jest.mock('firebase');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    BrowserRouter: (props: any) => props.children,
}));
jest.mock('./EditPanel', () => jest.fn());
jest.mock('./DocList', () => jest.fn());
jest.mock('./NewButton', () => jest.fn());
jest.mock('./DeleteButton', () => jest.fn());
jest.mock('./ProfilePanel', () => jest.fn());

const docRefsMock = {};
const userMock = { uid: 123 } as any as firebase.User;
const firestoreMock = {
    collection: jest.fn(),
};
const firestoreCollectionMock = {
    doc: jest.fn(),
}
const firestoreDocMock = {
    collection: jest.fn(),
};

beforeEach(() => {
    jest.resetAllMocks();
    (EditPanel as jest.Mock).mockReturnValue(null);
    (DocList as jest.Mock).mockReturnValue(null);
    (NewButton as jest.Mock).mockReturnValue(null);
    (DeleteButton as jest.Mock).mockReturnValue(null);
    (ProfilePanel as jest.Mock).mockReturnValue(null);
    (firebase.firestore as any as jest.Mock).mockReturnValue(firestoreMock);
    firestoreMock.collection.mockReturnValue(firestoreCollectionMock);
    firestoreCollectionMock.doc.mockReturnValue(firestoreDocMock);
    firestoreDocMock.collection.mockReturnValue(docRefsMock);
});

describe('when id is NOT present in the url', () => {

    it('should render without EditPanel and DeleteButton', () => {
        const { container } = render(
            <LoggedInContext.Provider value={{ user: userMock }}>
                <MemoryRouter>
                    <HomePanel />
                </MemoryRouter>
            </LoggedInContext.Provider>
        );

        expect(firebase.firestore).toHaveBeenCalledWith();
        expect(firestoreMock.collection).toHaveBeenCalledWith('users');
        expect(firestoreCollectionMock.doc).toHaveBeenCalledWith(userMock.uid);
        expect(firestoreDocMock.collection).toHaveBeenCalledWith('docs');

        expect(EditPanel).not.toHaveBeenCalled();
        expect(DocList).toHaveBeenCalledWith({
            docRefs: docRefsMock,
            onClickItem: expect.any(Function),
        }, {});
        expect(NewButton).toHaveBeenCalledWith({
            docRefs: docRefsMock,
        }, {});
        expect(DeleteButton).not.toHaveBeenCalled();
        expect(ProfilePanel).toHaveBeenCalledWith({}, {});

        expect(container.querySelector('.sidebar-mask')!.classList.values()).not.toContainEqual('visible');
        expect(container.querySelector('.sidebar')!.classList.values()).not.toContainEqual('visible');
    });
});

describe('when id is present in the URL', () => {

    it('should render EditPanel and DeleteButton', () => {
        render(
            <LoggedInContext.Provider value={{ user: userMock }}>
                <MemoryRouter initialEntries={[`/${userMock.uid}`]}>
                    <HomePanel />
                </MemoryRouter>
            </LoggedInContext.Provider>
        );

        expect(firebase.firestore).toHaveBeenCalledWith();
        expect(firestoreMock.collection).toHaveBeenCalledWith('users');
        expect(firestoreCollectionMock.doc).toHaveBeenCalledWith(userMock.uid);
        expect(firestoreDocMock.collection).toHaveBeenCalledWith('docs');

        expect(EditPanel).toHaveBeenCalledWith({
            docRefs: docRefsMock,
        }, {});
        expect(DocList).toHaveBeenCalledWith({
            docRefs: docRefsMock,
            onClickItem: expect.any(Function),
        }, {});
        expect(NewButton).toHaveBeenCalledWith({
            docRefs: docRefsMock,
        }, {});
        expect(DeleteButton).toHaveBeenCalledWith({
            docRefs: docRefsMock,
        }, {});
        expect(ProfilePanel).toHaveBeenCalledWith({}, {});
    });
});

describe('when click the menu button', () => {

    let container: HTMLElement;
    let docListOnClickItem: () => void;

    beforeEach(() => {
        container = render(
            <LoggedInContext.Provider value={{ user: userMock }}>
                <MemoryRouter>
                    <HomePanel />
                </MemoryRouter>
            </LoggedInContext.Provider>
        ).container;

        (DocList as jest.Mock).mockReset();
        (DocList as jest.Mock).mockImplementation((props: { onClickItem: () => void }) => {
            docListOnClickItem = props.onClickItem;
            return <div>DocList</div>;
        });

        fireEvent.click(getMenuButton());
    });

    it('should show the sidebar', () => {
        expect(container.querySelector('.sidebar-mask')!.classList.values()).toContainEqual('visible');
        expect(container.querySelector('.sidebar')!.classList.values()).toContainEqual('visible');
    });

    describe('when click the menu button again', () => {

        it('should close the sidebar', () => {
            fireEvent.click(getMenuButton());

            expect(container.querySelector('.sidebar-mask')!.classList.values()).not.toContainEqual('visible');
            expect(container.querySelector('.sidebar')!.classList.values()).not.toContainEqual('visible');
        });
    });

    describe('when click the item in the doc list', () => {

        it('should close the sidebar', () => {
            act(() => docListOnClickItem());

            expect(container.querySelector('.sidebar-mask')!.classList.values()).not.toContainEqual('visible');
            expect(container.querySelector('.sidebar')!.classList.values()).not.toContainEqual('visible');
        });
    });
});

function getMenuButton() {
    return screen.getByText('Menu', { selector: 'button' });
}

