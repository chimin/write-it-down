import React from 'react';
import { Text, View } from 'react-native';
import { GoogleSigninButton, GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
    webClientId: '201805209772-68fq8g7dh6p7ib0v3qqk7sa8m1mu3ui9.apps.googleusercontent.com',
});

const LoginPanel = () => {
    const login = async () => {
        await GoogleSignin.hasPlayServices();
        const user = await GoogleSignin.signIn();
        auth().signInWithCredential(auth.GoogleAuthProvider.credential(user.idToken));
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Text accessibilityLabel="Title text" style={{
                fontSize: 20,
                fontWeight: 'bold',
            }}>Write it down</Text>
            <GoogleSigninButton onPress={login} />
        </View>
    );
};

export default LoginPanel;
