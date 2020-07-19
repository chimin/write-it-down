import React from 'react';
import { useParams } from "react-router-dom";

const DeleteButton = (props: {
    docRefs: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>,
}) => {
    const { id } = useParams();

    const deleteDoc = async () => {
        if (window.confirm('Delete this?')) {
            await props.docRefs.doc(id).delete();
        }
    };

    return (
        <button type="button" onClick={deleteDoc}>Delete</button>
    );
};

export default DeleteButton;