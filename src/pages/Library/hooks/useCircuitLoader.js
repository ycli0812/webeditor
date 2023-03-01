import { useEffect, useState } from 'react';
import { getDesign } from '../../../utils/Request';
import useIndexedDB from '../../../hooks/useIndexedDB';

function useCircuitLoader(config) {
    const { source, filename, _id } = config;

    const [db, dbLoaded] = useIndexedDB();
    // const [loader, setLoader] = useState(null);
    const [circuit, setCircuit] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        // do nothing before IndexedDB is connected
        if(!dbLoaded) return;

        if (source === 'cloud') {
            getDesign(filename).then((res) => {
                setCircuit(res.data);
                setStatus('success');
            }).catch((res) => {
                setStatus('request error');
            });
        }

        if (source === 'local') {
            const request = db
                .transaction(['localFileHandlers'], 'readwrite')
                .objectStore('localFileHandlers')
                .get(_id);
            request.onsuccess = async (res) => {
                const { name, lastEdit, handler } = res.target.result;
                // check permission of the file
                if (await handler.queryPermission({}) !== 'granted') {
                    setStatus('denied');
                    return;
                }

                // try get file instance
                let file;
                try {
                    file = await handler.getFile();
                } catch(e) {
                    setStatus('not found');
                    return;
                }

                // read file content and parse the text into Object
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const fileContent = ev.target.result;
                    try {
                        const obj = JSON.parse(fileContent);
                        setCircuit(obj);
                        setStatus('success');
                    } catch (e) {
                        setStatus('invalid file');
                    }
                };
                reader.readAsText(file);
            };
        }
    }, [dbLoaded])

    return [circuit, status];
}

export default useCircuitLoader;