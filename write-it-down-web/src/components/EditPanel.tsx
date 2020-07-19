import '../../node_modules/simplemde/debug/simplemde.css';
import './EditPanel.css';

import React, { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SimpleMDE from 'simplemde';

const EditPanel = (props: {
    docRefs: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>,
}) => {
    const { id } = useParams();
    const docRef = useMemo(() => props.docRefs.doc(id), [id, props.docRefs]);
    const ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        let isChangingFromSnapshot = false;
        let timer: any;

        const editor = new SimpleMDE({
            element: ref.current!,
            autofocus: true,
            toolbar: false,
            status: false,
        });

        editor.codemirror.on('change', async () => {
            if (!isChangingFromSnapshot) {
                const newContent = editor.value();
                const newDoc = { title: extractTitle(newContent), content: newContent };
				await docRef.set(newDoc);
            }
        });

        const unsubscribeOnSnapshot = docRef.onSnapshot(doc => {
            if (!doc.metadata.hasPendingWrites) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    isChangingFromSnapshot = true;
                    editor.value(doc.data()?.content);
                    isChangingFromSnapshot = false;
                }, 100);
            }
        });

        return () => {
            unsubscribeOnSnapshot();
            editor.toTextArea();
            clearTimeout(timer);
        };
    }, [docRef]);

    return (
        <div className="edit-panel">
            <textarea ref={ref}></textarea>
        </div>
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