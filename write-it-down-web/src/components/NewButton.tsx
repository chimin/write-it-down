import React from 'react';
import { useHistory } from "react-router-dom";

const NewButton = (props: {
    docRefs: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>,
}) => {
    const history = useHistory();

    const newDoc = async () => {
        const docRef = await props.docRefs.add({ title: 'New', content: '' });
        history.push(`/${docRef.id}`);
    };

    return (
        <button type="button" onClick={newDoc}>New</button>
    );
};

export default NewButton;