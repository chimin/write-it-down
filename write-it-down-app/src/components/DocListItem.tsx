import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const DocListItem = (props: {
    doc: FirebaseFirestoreTypes.QueryDocumentSnapshot,
}) => {
    const navigation = useNavigation();
    const data = props.doc.data();
    const title = data.title || '<untitled>';

    const editDoc = () => {
        navigation.navigate('Edit', { id: props.doc.id });
    };

    return (
        <TouchableHighlight accessibilityHint="Edit document" onPress={editDoc}>
            <View style={{ padding: 10 }}>
                <Text accessibilityLabel="Title text">{title}</Text>
            </View>
        </TouchableHighlight>
    );
};

export default DocListItem;
