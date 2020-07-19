import { render } from '@testing-library/react';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import DocList from './DocList';
import DocListItem from './DocListItem';

jest.mock('./DocListItem', () => jest.fn());
jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
    useHistory: jest.fn(),
}));

const paramsMock = { id: 'active-doc-id' };
const historyMock = {
    push: jest.fn(),
};
const docRefsMock = {
    onSnapshot: jest.fn(),
} as any as firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
const onClickItemMock = jest.fn();
const useParamsMock = useParams;
const useHistoryMock = useHistory;

beforeEach(() => {
    jest.resetAllMocks();
    (DocListItem as jest.Mock).mockReturnValue(null);
    (useParamsMock as jest.Mock).mockReturnValue(paramsMock);
    (useHistoryMock as jest.Mock).mockReturnValue(historyMock);
});

it('should render nothing', () => {
    render(<DocList docRefs={docRefsMock} onClickItem={onClickItemMock} />);

    expect(useParamsMock).toHaveBeenCalledWith();
    expect(useHistoryMock).toHaveBeenCalledWith();
    expect(docRefsMock.onSnapshot).toBeCalledWith(expect.any(Function));
    expect(historyMock.push).not.toHaveBeenCalled();
    expect(DocListItem).not.toHaveBeenCalled();
});

describe('when docRefs.onSnapshot invoke the callback', () => {

    it('should render the DocListItem', () => {
        const doc = { id: 'doc-id' };
        (docRefsMock.onSnapshot as jest.Mock).mockImplementation((callback: (newDocRefs: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => void) => {
            callback({ docs: [doc] } as firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>);
        });

        render(<DocList docRefs={docRefsMock} onClickItem={onClickItemMock} />);

        expect(useParamsMock).toHaveBeenCalledWith();
        expect(useHistoryMock).toHaveBeenCalledWith();
        expect(docRefsMock.onSnapshot).toBeCalledWith(expect.any(Function));
        expect(DocListItem).toHaveBeenCalledWith({
            doc: doc,
            onClick: onClickItemMock,
        }, {});
    });

    describe('when the list does NOT contains the active doc id', () => {

        describe('when the doc list is NOT empty', () => {

            it('should navigate to the first doc', () => {
                const doc = { id: 'doc-id' };
                (docRefsMock.onSnapshot as jest.Mock).mockImplementation((callback: (newDocRefs: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => void) => {
                    callback({ docs: [doc] } as firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>);
                });

                render(<DocList docRefs={docRefsMock} onClickItem={onClickItemMock} />);

                expect(useParamsMock).toHaveBeenCalledWith();
                expect(useHistoryMock).toHaveBeenCalledWith();
                expect(docRefsMock.onSnapshot).toBeCalledWith(expect.any(Function));
                expect(historyMock.push).toBeCalledWith(`/${doc.id}`);
                expect(DocListItem).toHaveBeenCalledWith({
                    doc: doc,
                    onClick: onClickItemMock,
                }, {});
            });
        });

        describe('when the doc list is empty', () => {

            it('should navigate to the root', () => {
                (docRefsMock.onSnapshot as jest.Mock).mockImplementation((callback: (newDocRefs: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => void) => {
                    callback({ docs: [] } as any as firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>);
                });

                render(<DocList docRefs={docRefsMock} onClickItem={onClickItemMock} />);

                expect(useParamsMock).toHaveBeenCalledWith();
                expect(useHistoryMock).toHaveBeenCalledWith();
                expect(docRefsMock.onSnapshot).toBeCalledWith(expect.any(Function));
                expect(historyMock.push).toBeCalledWith('/');
                expect(DocListItem).not.toHaveBeenCalled();
            });
        });
    });
});