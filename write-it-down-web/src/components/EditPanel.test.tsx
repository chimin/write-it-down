import { render } from '@testing-library/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import SimpleMDE from 'simplemde';

import EditPanel from './EditPanel';

jest.mock('simplemde');
jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
}));

const useParamsMock = useParams;
const editorMock = {
    codemirror: {
        on: jest.fn(),
    },
    value: jest.fn(),
    toTextArea: jest.fn(),
} as any as SimpleMDE;
const docRefsMock = {
    doc: jest.fn(),
} as any as firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
const docRefMock = {
    id: 'doc-id',
    onSnapshot: jest.fn(),
    set: jest.fn(),
} as any as firebase.firestore.DocumentReference;
const docDataMock = jest.fn();
const docRefOnSnapshotUnsubscribeMock = jest.fn();
const params = { id: docRefMock.id };

beforeEach(() => {
    jest.resetAllMocks();
    (SimpleMDE as any as jest.Mock).mockImplementation(() => editorMock);
    (useParamsMock as jest.Mock).mockReturnValue(params);
    (docRefsMock.doc as jest.Mock).mockReturnValue(docRefMock);
    (docRefMock.onSnapshot as jest.Mock).mockReturnValue(docRefOnSnapshotUnsubscribeMock);
});

it('should render the editor', () => {
    const screen = render(<EditPanel docRefs={docRefsMock} />);
    const container = screen.container;

    expect(container.querySelector('textarea')).not.toBeNull();
    expect(useParamsMock).toHaveBeenCalledTimes(1);
    expect(docRefsMock.doc).toHaveBeenCalledWith(params.id);
    expect(editorMock.codemirror.on).toHaveBeenCalledWith('change', expect.any(Function));
    expect(editorMock.value).not.toHaveBeenCalled();
    expect(docRefMock.set).not.toHaveBeenCalled();
    expect(docDataMock).not.toHaveBeenCalled();
    expect(docRefOnSnapshotUnsubscribeMock).not.toHaveBeenCalled();
    expect(editorMock.toTextArea).not.toHaveBeenCalled();
});

describe("when unmount", () => {

    it('should unsubcribe events and reset editor', () => {
        const screen = render(<EditPanel docRefs={docRefsMock} />);
        screen.unmount();

        expect(docRefOnSnapshotUnsubscribeMock).toHaveBeenCalledWith();
        expect(editorMock.toTextArea).toHaveBeenCalledWith();
    });
});

describe('when editor emit change event', () => {

    it('should update the document with new title and content', () => {
        const newTitle = 'this is the title';
        const newContent = `${newTitle}\nthis is the content`;

        editorMock.codemirror.on.mockImplementation(
            async (_: any, callback: () => Promise<void>) => {
                await callback();
            });
        (editorMock.value as jest.Mock).mockReturnValue(newContent);

        render(<EditPanel docRefs={docRefsMock} />);

        expect(useParamsMock).toHaveBeenCalledTimes(1);
        expect(docRefsMock.doc).toHaveBeenCalledWith(params.id);
        expect(editorMock.codemirror.on).toHaveBeenCalledWith('change', expect.any(Function));
        expect(editorMock.value).toHaveBeenCalledWith();
        expect(docRefMock.set).toHaveBeenCalledWith({ title: newTitle, content: newContent });
        expect(docDataMock).not.toHaveBeenCalled();
        expect(docRefOnSnapshotUnsubscribeMock).not.toHaveBeenCalled();
        expect(editorMock.toTextArea).not.toHaveBeenCalled();
    });
});

describe('when document reference emit snapshot event', () => {

    const newContent = 'this is the new content';

    describe('when document has pending writes', () => {

        it('should NOT update the editor with new content', () => {
            (docRefMock.onSnapshot as jest.Mock).mockImplementation((callback: (doc: any) => void) => {
                callback({
                    metadata: { hasPendingWrites: true },
                    data: docDataMock,
                });
                return docRefOnSnapshotUnsubscribeMock;
            });

            render(<EditPanel docRefs={docRefsMock} />);

            expect(useParamsMock).toHaveBeenCalledTimes(1);
            expect(docRefsMock.doc).toHaveBeenCalledWith(params.id);
            expect(editorMock.codemirror.on).toHaveBeenCalledWith('change', expect.any(Function));
            expect(editorMock.value).not.toHaveBeenCalled();
            expect(docRefMock.set).not.toHaveBeenCalled();
            expect(docDataMock).not.toHaveBeenCalled();
            expect(docRefOnSnapshotUnsubscribeMock).not.toHaveBeenCalled();
            expect(editorMock.toTextArea).not.toHaveBeenCalled();
        });
    });

    describe('when document has NO pending writes', () => {

        it('should update the editor with new content', () => {
            jest.useFakeTimers();

            (docRefMock.onSnapshot as jest.Mock).mockImplementation((callback: (doc: any) => void) => {
                callback({
                    metadata: { hasPendingWrites: false },
                    data: docDataMock,
                });
                return docRefOnSnapshotUnsubscribeMock;
            });
            (docDataMock as jest.Mock).mockReturnValue({ content: newContent });

            render(<EditPanel docRefs={docRefsMock} />);
            jest.runAllTimers();

            expect(useParamsMock).toHaveBeenCalledTimes(1);
            expect(docRefsMock.doc).toHaveBeenCalledWith(params.id);
            expect(editorMock.codemirror.on).toHaveBeenCalledWith('change', expect.any(Function));
            expect(editorMock.value).toHaveBeenCalledWith(newContent);
            expect(docRefMock.set).not.toHaveBeenCalled();
            expect(docDataMock).toHaveBeenCalledWith();
            expect(docRefOnSnapshotUnsubscribeMock).not.toHaveBeenCalled();
            expect(editorMock.toTextArea).not.toHaveBeenCalled();
        });
    });
});