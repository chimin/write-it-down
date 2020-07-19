import React from 'react';
import { useNavigation } from '@react-navigation/native';
import NewButton from '../src/components/NewButton';
import { render, RenderAPI, fireEvent, waitFor } from '@testing-library/react-native';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Button } from 'react-native';

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
}));

const docRefsMock = {
    add: jest.fn(),
} as any as FirebaseFirestoreTypes.CollectionReference;
const navigationMock = {
    navigate: jest.fn(),
};

beforeEach(() => {
    jest.resetAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(navigationMock);
});

it('should render a New button', () => {
    const screen = render(<NewButton docRefs={docRefsMock} />);
    getNewButton(screen);

    expect(useNavigation).toHaveBeenCalledWith();
    expect(docRefsMock.add).not.toHaveBeenCalled();
    expect(navigationMock.navigate).not.toHaveBeenCalled();
});

describe('when click the New button', () => {

    it('should create a new document', async () => {
        const docRefMock = { id: 'doc-id' };
        (docRefsMock.add as jest.Mock).mockResolvedValue(docRefMock);

        const screen = render(<NewButton docRefs={docRefsMock} />);
        fireEvent.press(getNewButton(screen)!);

        expect(useNavigation).toHaveBeenCalledWith();
        expect(docRefsMock.add).toHaveBeenCalledWith({ title: 'New', content: '' });

        await waitFor(() => {
            expect(navigationMock.navigate).toHaveBeenCalledWith('Edit', { id: docRefMock.id });
        });
    });
});

function getNewButton(screen: RenderAPI) {
    return screen.getByA11yLabel('New button');
}
