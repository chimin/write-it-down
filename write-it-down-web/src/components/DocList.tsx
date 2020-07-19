import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import DocListItem from './DocListItem';

const DocList = (props: {
    docRefs: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>,
    onClickItem?: () => void,
}) => {
    const { id } = useParams();
    const history = useHistory();
    const [list, setList] = useState<firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>[]>();

    useEffect(() => {
        return props.docRefs.onSnapshot(newDocRefs => {
            setList(newDocRefs.docs.sort((a, b) => compare(a.data().title, b.data().title)));
        });
    }, [props.docRefs]);

    useEffect(() => {
        if (list && !list.find(i => i.id == id)) {
            if (list.length) {
                history.push(`/${list[0].id}`);
            } else {
                history.push('/');
            }
        }
    }, [id, history, list]);

    return (
        <div>
            {list?.map(doc => (<DocListItem key={doc.id} doc={doc} onClick={props.onClickItem} />))}
        </div>
    );
};

function compare(a: any, b: any) {
    return typeof a === 'string' && typeof b === 'string' ? a.localeCompare(b) :
        !a && b ? -1 : a && !b ? 1 : a < b ? -1 : a > b ? 1 : 0;
}

export default DocList;