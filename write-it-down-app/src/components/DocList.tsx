import React, { useState, useEffect } from 'react';
import DocListItem from './DocListItem';
import { FlatList } from 'react-native';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const DocList = (props: {
    docRefs: FirebaseFirestoreTypes.CollectionReference,
}) => {
    const [list, setList] = useState<FirebaseFirestoreTypes.QueryDocumentSnapshot[]>();

    useEffect(() => {
        return props.docRefs.onSnapshot(newDocRefs => {
            setList(newDocRefs.docs.sort((a, b) => compare(a.data().title, b.data().title)));
        });
    }, [props.docRefs]);

    return (
        <FlatList accessibilityLabel="List" data={list}
            renderItem={itemProps => <DocListItem {...itemProps} doc={itemProps.item} />}
            keyExtractor={item => item.id} />
    );
};

function compare(a: any, b: any) {
    return typeof a === 'string' && typeof b === 'string' ? a.localeCompare(b) :
        !a && b ? -1 : a && !b ? 1 : a < b ? -1 : a > b ? 1 : 0;
}

export default DocList;
