import axios from 'axios';

function getDesignList() {
    const designList = axios.get(
        'http://localhost:8080/design'
    );
    return designList;
}

export { getDesignList };