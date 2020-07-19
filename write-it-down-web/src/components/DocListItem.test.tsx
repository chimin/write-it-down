import { render } from '@testing-library/react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

import DocListItem from './DocListItem';

jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
    Link: jest.fn(),
}));

const paramsMock = { id: 'active-doc-id' };
const docDataMock = { title: 'doc-title' };
const docMock = {
    id: 'doc-id',
    data: jest.fn(),
} as any as firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>;
const onClickMock = jest.fn();
const useParamsMock = useParams;

beforeEach(() => {
    jest.resetAllMocks();
    (useParamsMock as jest.Mock).mockReturnValue(paramsMock);
    (docMock.data as jest.Mock).mockReturnValue(docDataMock);
    (Link as jest.Mock).mockReturnValue(null);
});

it('should render a Link', () => {
    render(<DocListItem doc={docMock} onClick={onClickMock} />);

    expect(useParamsMock).toHaveBeenCalledWith();
    expect(docMock.data).toHaveBeenCalledWith();
    expect(Link).toHaveBeenCalledWith({
        to: `/${docMock.id}`,
        className: '',
        onClick: onClickMock,
        children: docDataMock.title,
    }, {});
    expect(onClickMock).not.toHaveBeenCalled();
});

describe('when title is empty', () => {

    it('should render a Link with <untitled>', () => {
        const customDocDataMock = {};
        (docMock.data as jest.Mock).mockReturnValue(customDocDataMock);

        render(<DocListItem doc={docMock} onClick={onClickMock} />);

        expect(useParamsMock).toHaveBeenCalledWith();
        expect(docMock.data).toHaveBeenCalledWith();
        expect(Link).toHaveBeenCalledWith({
            to: `/${docMock.id}`,
            className: '',
            onClick: onClickMock,
            children: '<untitled>',
        }, {});
        expect(onClickMock).not.toHaveBeenCalled();
    });
});

describe('when doc id is the active doc id', () => {

    it('should render a Link with active class', () => {
        const customDocMock = {
            id: paramsMock.id,
            data: jest.fn().mockReturnValue(docDataMock),
        } as any as firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>;

        render(<DocListItem doc={customDocMock} onClick={onClickMock} />);

        expect(useParamsMock).toHaveBeenCalledWith();
        expect(customDocMock.data).toHaveBeenCalledWith();
        expect(Link).toHaveBeenCalledWith({
            to: `/${customDocMock.id}`,
            className: 'active',
            onClick: onClickMock,
            children: docDataMock.title,
        }, {});
        expect(onClickMock).not.toHaveBeenCalled();
    });
});
