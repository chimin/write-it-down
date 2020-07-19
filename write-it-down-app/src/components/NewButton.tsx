import React from 'react';
import { Button } from 'react-native';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const NewButton = (props: {
    docRefs: FirebaseFirestoreTypes.CollectionReference,
}) => {
    const navigation = useNavigation();

    const newDoc = async () => {
        const docRef = await props.docRefs.add({ title: 'New', content: '' });
        navigation.navigate('Edit', { id: docRef.id });
    };

    return (<Button accessibilityLabel="New button" title="New" onPress={newDoc} />);
};

export default NewButton;
