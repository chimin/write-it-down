import React from 'react';
import { Alert, Button, AlertButton } from 'react-native';
import { fireEvent, render, RenderAPI, waitFor, waitForElement } from '@testing-library/react-native';

import DeleteButton from '../src/components/DeleteButton';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

jest.mock('react-native', () => Object.setPrototypeOf(
    {
        Alert: {
            alert: jest.fn(),
        },
    },
    jest.requireActual('react-native'))
);
jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
}));

const docRefMock = {
    delete: jest.fn(),
} as any as FirebaseFirestoreTypes.DocumentReference;
const navigationMock = {
    navigate: jest.fn(),
};

beforeEach(() => {
    jest.resetAllMocks();
    (useNavigation as jest.Mock).mockReturnValue(navigationMock);
});

it('should render a Delete button', () => {
    const screen = render(<DeleteButton docRef={docRefMock} />);
    expect(getDeleteButton(screen)).not.toBeUndefined();

    expect(useNavigation).toHaveBeenCalled();
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(docRefMock.delete).not.toHaveBeenCalled();
    expect(navigationMock.navigate).not.toHaveBeenCalled();
});

describe('when click the Delete button', () => {

    describe('when user click Yes in the confirm prompt', () => {

        it('should delete the doc', async () => {
            const alertPromise = new Promise(resolve =>
                (Alert.alert as jest.Mock).mockImplementation(async (_title, _message, buttons: AlertButton[]) => {
                    await buttons.filter(it => it.text == 'Yes').shift()!.onPress?.apply(null);
                    resolve();
                })
            );
            (docRefMock.delete as jest.Mock).mockResolvedValue(null);

            const screen = render(<DeleteButton docRef={docRefMock} />);
            fireEvent.press(getDeleteButton(screen)!);

            await alertPromise;

            expect(useNavigation).toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith('Delete', 'Delete this?', expect.anything());
            expect(docRefMock.delete).toHaveBeenCalledWith();
            expect(navigationMock.navigate).toHaveBeenCalledWith('List');
        });
    });

    describe('when user click No in the confirm prompt', () => {

        it('should NOT delete the doc', async () => {
            const alertPromise = new Promise(resolve =>
                (Alert.alert as jest.Mock).mockImplementation(async (_title, _message, buttons: AlertButton[]) => {
                    await buttons.filter(it => it.text == 'No').shift()!.onPress?.apply(null);
                    resolve();
                })
            );
            (docRefMock.delete as jest.Mock).mockResolvedValue(null);

            const screen = render(<DeleteButton docRef={docRefMock} />);
            fireEvent.press(getDeleteButton(screen)!);

            await alertPromise;

            expect(useNavigation).toHaveBeenCalled();
            expect(Alert.alert).toHaveBeenCalledWith('Delete', 'Delete this?', expect.anything());
            expect(docRefMock.delete).not.toHaveBeenCalled();
            expect(navigationMock.navigate).not.toHaveBeenCalled();
        });
    });
});

function getDeleteButton(screen: RenderAPI) {
    return screen.getByA11yLabel('Delete button');
}
