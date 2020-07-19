import React from 'react';
import { Button, Alert } from 'react-native';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const DeleteButton = (props: {
    docRef: FirebaseFirestoreTypes.DocumentReference,
}) => {
    const navigation = useNavigation();

    const deleteDoc = async () => {
        Alert.alert('Delete', 'Delete this?', [
            {
                text: 'Yes',
                style: 'destructive',
                onPress: async () => {
                    await props.docRef.delete();
                    navigation.navigate('List');
                },
            }, {
                text: 'No',
                style: 'cancel',
            },
        ]);
    };

    return (<Button accessibilityLabel="Delete button" title="Delete" onPress={deleteDoc} />);
};

export default DeleteButton;
