import './DocListItem.css';

import React from 'react';
import { Link, useParams } from 'react-router-dom';

const DocListItem = (props: {
    doc: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>,
    onClick?: () => void,
}) => {
    const { id } = useParams();
    const data = props.doc.data();
    const title = data.title || '<untitled>';

    return (
        <div className="doc-list-item">
            <Link to={`/${props.doc.id}`} className={props.doc.id == id ? 'active' : ''} onClick={props.onClick}>{title}</Link>
        </div>
    );
};

export default DocListItem;