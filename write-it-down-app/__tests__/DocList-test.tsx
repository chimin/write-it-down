import React from 'react';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { render, RenderAPI } from '@testing-library/react-native';
import DocList from '../src/components/DocList';
import DocListItem from '../src/components/DocListItem';

jest.mock('../src/components/DocListItem', () => jest.fn());

const docRefsMock = {
    onSnapshot: jest.fn(),
} as any as FirebaseFirestoreTypes.CollectionReference;
const docRefsOnSnapshotUnsubscribeMock = jest.fn();

beforeEach(() => {
    jest.resetAllMocks();
    (docRefsMock.onSnapshot as jest.Mock).mockReturnValue(docRefsOnSnapshotUnsubscribeMock);
    (DocListItem as jest.Mock).mockReturnValue(null);
});

it('should render an empty list', () => {
    const screen = render(<DocList docRefs={docRefsMock} />);
    getList(screen);

    expect(docRefsMock.onSnapshot).toHaveBeenCalledWith(expect.any(Function));
    expect(docRefsOnSnapshotUnsubscribeMock).not.toHaveBeenCalled();
    expect(DocListItem).not.toHaveBeenCalled();
});

describe('when unmount', () => {

    it('should unsubscribe events', () => {
        const screen = render(<DocList docRefs={docRefsMock} />);
        screen.unmount();

        expect(docRefsOnSnapshotUnsubscribeMock).toHaveBeenCalled();
    });
});

describe('when the snapshot event is emitted', () => {

    it('should render a list of items', () => {
        const doc = { id: 'doc-id' };
        (docRefsMock.onSnapshot as jest.Mock).mockImplementation((callback: (newDocRefs: FirebaseFirestoreTypes.QuerySnapshot) => void) => {
            callback({ docs: [doc] } as FirebaseFirestoreTypes.QuerySnapshot);
        });

        render(<DocList docRefs={docRefsMock} />);

        expect(docRefsMock.onSnapshot).toHaveBeenCalledWith(expect.any(Function));
        expect(docRefsOnSnapshotUnsubscribeMock).not.toHaveBeenCalled();
        expect(DocListItem).toBeCalledWith(expect.objectContaining({ doc }), {});
    });
});

function getList(screen: RenderAPI) {
    return screen.getByA11yLabel('List');
}
