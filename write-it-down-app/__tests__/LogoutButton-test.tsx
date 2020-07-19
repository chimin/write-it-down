import React from 'react';
import { render, RenderAPI, fireEvent } from '@testing-library/react-native';
import LogoutButton from '../src/components/LogoutButton';
import LoggedInContext from '../src/contexts/LoggedInContext';
import { Button } from 'react-native';

const clearMock = jest.fn();

beforeEach(() => {
    jest.resetAllMocks();
});

it('should render a Logout button', () => {
    const screen = render(
        <LoggedInContext.Provider value={{ clear: clearMock }}>
            <LogoutButton />
        </LoggedInContext.Provider>
    );
    getLogoutButton(screen);

    expect(clearMock).not.toHaveBeenCalled();
});

describe('when click the Logout button', () => {

    it('should logout the user', () => {
        const screen = render(
            <LoggedInContext.Provider value={{ clear: clearMock }}>
                <LogoutButton />
            </LoggedInContext.Provider>
        );
        fireEvent.press(getLogoutButton(screen)!);

        expect(clearMock).toHaveBeenCalledWith();
    });
});

function getLogoutButton(screen: RenderAPI) {
    return screen.getByA11yLabel('Logout button');
}
