import { useState, useEffect } from "react";

function useIndexedDB() {
    const [db, setDb] = useState(null);
    const [dbLoaded, setDbLoaded] = useState(false);

    useEffect(() => {
        const request = window.indexedDB.open('testDB');
        request.onsuccess = (ev) => {
            console.log('Open DB success');
            const dbHandler = ev.target.result;
            setDb(dbHandler);
            setDbLoaded(true);
        };
        request.onerror = (ev) => {
            console.log('Open DB error, msg:', ev);
        };
        request.onupgradeneeded = (ev) => {
            const dbHandler = ev.target.result;
            dbHandler.createObjectStore('localFileHandlers', {
                keyPath: '_id',
                autoIncrement: true
            });
        };

        return () => {
            if(db !== null) db.close();
        };
    }, []);

    return [db, dbLoaded];
}

export default useIndexedDB;