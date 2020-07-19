import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { TextInput } from 'react-native-gesture-handler';
import { RouteProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { View, Button } from 'react-native';
import DeleteButton from './DeleteButton';
import LogoutButton from './LogoutButton';

const EditPanel = (props: {
    docRefs: FirebaseFirestoreTypes.CollectionReference,
    route: RouteProp<ParamListBase, string>,
    logout: () => void,
}) => {
    const navigation = useNavigation();
    const { id } = props.route.params as { id: string };
    const docRef = useMemo(() => props.docRefs.doc(id), [id, props.docRefs]);
    const [content, setContent] = React.useState('');

    const listDocs = () => {
        navigation.navigate('List');
    };

    let isChangingFromSnapshot = false;

    const onChangeText = async (newContent: string) => {
        if (!isChangingFromSnapshot) {
            setContent(newContent);
            const newDoc = { title: extractTitle(newContent), content: newContent };
            await docRef.set(newDoc);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Write it down',
            headerLeft: () => (
                <Button title="Menu" onPress={listDocs} />
            ),
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <DeleteButton docRef={docRef} />
                    <LogoutButton />
                </View>
            ),
        });
    });

    useEffect(() => {
        let timer: any;

        const unsubscribeOnSnapshot = docRef.onSnapshot(doc => {
            if (!doc.metadata.hasPendingWrites) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    setContent(doc.data()?.content);
                }, 100);
            }
        });

        return () => {
            unsubscribeOnSnapshot();
            clearTimeout(timer);
        };
    }, [docRef]);

    return (
        <TextInput accessibilityLabel="Editor" value={content} onChangeText={onChangeText}
            multiline={true} autoFocus={true} textAlignVertical="top" style={{ flexGrow: 1 }} />
    );
};

function extractTitle(content: string) {
    const match = extractFirstLine(content)?.match(/^[^0-9a-zA-Z]*(.*)$/);
    return match && match[1];
}

function extractFirstLine(content: string) {
    return content && content.split('\n')
        .filter(l => !l.match(/^\s+$/))
        .shift();
}

export default EditPanel;
