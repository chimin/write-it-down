import React from 'react';
import { render, RenderAPI, fireEvent } from '@testing-library/react-native';
import DocListItem from '../src/components/DocListItem';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { TouchableHighlight, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
}));

const docDataMock = {
    id: 'doc-id',
    title: 'doc-title',
};
const docMock = {
    data: jest.fn(),
} as any as FirebaseFirestoreTypes.QueryDocumentSnapshot;
const navigationMock = {
    navigate: jest.fn(),
};

beforeEach(() => {
    jest.resetAllMocks();
    (docMock.data as jest.Mock).mockReturnValue(docDataMock);
    (useNavigation as jest.Mock).mockReturnValue(navigationMock);
});

it('should render the doc title', () => {
    const screen = render(<DocListItem doc={docMock} />);
    getPressable(screen);
    getTitleText(screen);

    expect(getTitleText(screen).children[0]).toBe(docDataMock.title);

    expect(useNavigation).toHaveBeenCalledWith();
    expect(docMock.data).toHaveBeenCalledWith();
    expect(navigationMock.navigate).not.toHaveBeenCalled();
});

describe('when the doc has NO title', () => {

    it('should render with default title', () => {
        (docMock.data as jest.Mock).mockReturnValue({});

        const screen = render(<DocListItem doc={docMock} />);

        expect(getTitleText(screen).children[0]).toBe('<untitled>');

        expect(useNavigation).toHaveBeenCalledWith();
        expect(docMock.data).toHaveBeenCalledWith();
        expect(navigationMock.navigate).not.toHaveBeenCalled();
    });
});

describe('when click the pressable', () => {

    it('should edit the doc', () => {
        const screen = render(<DocListItem doc={docMock} />);
        fireEvent.press(getPressable(screen));

        expect(useNavigation).toHaveBeenCalledWith();
        expect(docMock.data).toHaveBeenCalledWith();
        expect(navigationMock.navigate).toHaveBeenCalledWith('Edit', { id: docMock.id });
    });
});

function getPressable(screen: RenderAPI) {
    return screen.getByA11yHint('Edit document');
}

function getTitleText(screen: RenderAPI) {
    return screen.getByA11yLabel('Title text');
}