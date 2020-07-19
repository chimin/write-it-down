import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import LoggedInContext from '../contexts/LoggedInContext';
import ProfilePanel from './ProfilePanel';

const userMock = { displayName: 'user-display-name' } as any as firebase.User;

it('should render user name and a Logout button', () => {
    render(
        <LoggedInContext.Provider value={{ user: userMock }}>
            <ProfilePanel />
        </LoggedInContext.Provider>
    );

    screen.getByText(userMock.displayName!, { selector: '.username' });
    getLogoutButton();
});

describe('when click the Logout button', () => {

    it('should logout the user', () => {
        const clearMock = jest.fn();

        render(
            <LoggedInContext.Provider value={{ user: userMock, clear: clearMock }}>
                <ProfilePanel />
            </LoggedInContext.Provider>
        );
        fireEvent.click(getLogoutButton());

        expect(clearMock).toHaveBeenCalledTimes(1);
    });
});

function getLogoutButton() {
    return screen.getByText('Logout', { selector: 'button' });
}
