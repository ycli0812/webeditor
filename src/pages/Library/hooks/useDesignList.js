import React, { useState, useEffect } from 'react';

// Utils
import { getDesignList } from '../../../utils/Request';

function useDesignList() {
    const [designList, setDesignList] = useState([]);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        getDesignList().then((res) => {
            console.log(res);
            setDesignList(res.data);
            setStatus('success');
        }).catch((res) => {
            console.error('Can not load files.');
            setStatus('fail');
        });
    }, []);

    return [designList, status];
}

export default useDesignList;