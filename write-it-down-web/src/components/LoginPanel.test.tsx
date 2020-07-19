import { render, screen, wait } from '@testing-library/react';
import * as firebaseui from 'firebaseui';
import React from 'react';

import LoginPanel from './LoginPanel';

jest.mock('firebase');
jest.mock('firebaseui');

const authUiMock = {
    start: jest.fn(),
    delete: jest.fn(),
};

beforeEach(() => {
    jest.resetAllMocks();
    (firebaseui.auth.AuthUI as any as jest.Mock).mockImplementation(() => authUiMock);
});

it('should render the title and the Firebase Auth UI', async () => {
    render(<LoginPanel />);
    getTitleHeader();

    await wait();

    expect(authUiMock.start).toHaveBeenCalledTimes(1)
    expect(authUiMock.delete).not.toHaveBeenCalled();
});

describe("when unmount", () => {

    it("should delete the auth UI", async () => {
        const screen = render(<LoginPanel />);
        screen.unmount();

        await wait();

        expect(authUiMock.delete).toHaveBeenCalledTimes(1);
    });
});

function getTitleHeader() {
    return screen.getByText('Write it down', { selector: 'h1' });
}