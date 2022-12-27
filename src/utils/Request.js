import axios from 'axios';

function getDesignList() {
    const designList = axios.get(
        'http://localhost:8080/designlist'
    );
    return designList;
}

function getDesign(filename) {
    const design = axios({
        method: 'post',
        url: 'http://localhost:8080/design',
        params: {
            filename: filename
        }
    });
    return design;
}

function saveDesign(filename, circuit) {
    const resp = axios({
        method: 'post',
        url: 'http://localhost:8080/save',
        data: {
            file: filename,
            content: circuit
        }
    });
    return resp;
}

export { getDesignList, getDesign, saveDesign };