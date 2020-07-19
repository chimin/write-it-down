import { fireEvent, render, screen, wait } from '@testing-library/react';
import React from 'react';
import { useHistory } from 'react-router-dom';

import NewButton from './NewButton';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(),
}));

const useHistoryMock = useHistory;
const docRefsMock = {
    add: jest.fn(),
} as any as firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
const historyMock = {
    push: jest.fn(),
};

beforeEach(() => {
    jest.resetAllMocks();
    (useHistoryMock as jest.Mock).mockReturnValue(historyMock);
});

it('should render a New button', () => {
    render(<NewButton docRefs={docRefsMock} />);
    getNewButton();

    expect(useHistoryMock).toHaveBeenCalledWith();
    expect(docRefsMock.add).not.toHaveBeenCalled();
    expect(historyMock.push).not.toHaveBeenCalled();
});

describe('when click the New button', () => {

    it('should create a new document', async () => {
        const newDocRef = { id: 'doc-id' };
        (docRefsMock.add as jest.Mock).mockResolvedValue(newDocRef);

        render(<NewButton docRefs={docRefsMock} />);
        fireEvent.click(getNewButton());

        expect(useHistoryMock).toHaveBeenCalledWith();
        expect(docRefsMock.add).toHaveBeenCalledWith({ title: 'New', content: '' });
        await wait();
        expect(historyMock.push).toHaveBeenCalledWith(`/${newDocRef.id}`)
    });
});

function getNewButton() {
    return screen.getByText('New', { selector: 'button' });
}