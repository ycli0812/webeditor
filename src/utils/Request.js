import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';
// axios.defaults.timeout = 30000;

function getDesignList() {
    const designList = axios.get(
        '/designlist'
    );
    return designList;
}

function getDesign(filename) {
    const design = axios({
        method: 'post',
        url: '/design',
        params: {
            filename: filename
        }
    });
    return design;
}

function saveDesign(filename, circuit) {
    const resp = axios({
        method: 'post',
        url: '/save',
        data: {
            file: filename,
            content: circuit
        }
    });
    return resp;
}

function newDesign(filename) {
    const resp = axios({
        method: 'post',
        url: '/create',
        data: {
            file: filename
        }
    });
    return resp;
}

export { getDesignList, getDesign, saveDesign, newDesign };