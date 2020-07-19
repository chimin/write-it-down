import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { useParams } from 'react-router-dom';

import DeleteButton from './DeleteButton';

jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
}));

global.confirm = jest.fn();

const paramsMock = { id: 'doc-id' };
const docMock = {
    delete: jest.fn(),
};
const docRefsMock = {
    doc: jest.fn(),
} as any as firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
const useParamsMock = useParams;
const windowConfirmMock = global.confirm;

beforeEach(() => {
    jest.resetAllMocks();
    (useParamsMock as jest.Mock).mockReturnValue(paramsMock);
    (docRefsMock.doc as jest.Mock).mockReturnValue(docMock);
});

it('should render a Delete button', () => {
    render(<DeleteButton docRefs={docRefsMock} />);
    getDeleteButton();

    expect(useParamsMock).toHaveBeenCalled();
    expect(windowConfirmMock).not.toHaveBeenCalled();
    expect(docRefsMock.doc).not.toHaveBeenCalled();
    expect(docMock.delete).not.toHaveBeenCalled();
});

describe("when click the Delete button", () => {

    describe("when user click Yes in the confirm prompt", () => {

        it("should delete the doc", () => {
            (windowConfirmMock as jest.Mock).mockReturnValue(true);

            render(<DeleteButton docRefs={docRefsMock} />);
            fireEvent.click(getDeleteButton());

            expect(useParamsMock).toHaveBeenCalled();
            expect(windowConfirmMock).toHaveBeenCalledWith('Delete this?');
            expect(docRefsMock.doc).toHaveBeenCalledWith(paramsMock.id);
            expect(docMock.delete).toHaveBeenCalledTimes(1);
        });
    });

    describe("when user click No in the confirm prompt", () => {

        it("should NOT delete the doc", () => {
            (windowConfirmMock as jest.Mock).mockReturnValue(false);

            render(<DeleteButton docRefs={docRefsMock} />);
            fireEvent.click(getDeleteButton());

            expect(useParamsMock).toHaveBeenCalled();
            expect(windowConfirmMock).toHaveBeenCalledWith('Delete this?');
            expect(docRefsMock.doc).not.toHaveBeenCalled();
            expect(docMock.delete).not.toHaveBeenCalled();
        });
    });
});

function getDeleteButton() {
    return screen.getByText("Delete", { selector: 'button' });
}
