import axios from "axios";

declare global {
    interface Window {
        showOpenFilePicker: Function
    }
    interface FileSystemFileHandle {
        queryPermission: Function
    }
};

const readCircuitFromFile = async () => {
    const handlers = await window.showOpenFilePicker({
        multiple: false,
        types: [
            {
                description: 'JSON',
                accept: {
                    'text/json': ['.json']
                }
            }
        ],
        excludeAcceptAllOption: true
    });
    const handler = handlers[0];
    const file = await handler.getFile();
    let reader = new FileReader();

    return new Promise((resolve: Function, reject: Function) => {
        reader.onload = (res: any) => {
            resolve([handler.name, res.target.result])
        }
        reader.onerror = () => {
            reject();
        }
        reader.readAsText(file);
    });
};

const requestVerify = async (sampleCircuit: any, targetCircuit: any) => {
    // let strSample: string = JSON.stringify(sampleCircuit);
    // let strTarget: string = JSON.stringify(targetCircuit);
    const token = axios({
        method: 'post',
        url: '/verify',
        data: {
            sample: sampleCircuit,
            target: targetCircuit
        }
    });
    return token; 
};

const requestVerificationResult = (token: string) => {
    if(token === null) {
        console.error('Null token is given.');
        return;
    }
    const result = axios({
        method: 'post',
        url: '/verifyresult',
        data: {
            token: token
        },
        timeout: 1000
    });
    return result;
}

export { readCircuitFromFile, requestVerify, requestVerificationResult };