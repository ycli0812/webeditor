import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';

// Style
import libraryStyle from './Library.module.css';

// Images
import blueprint from '../../assets/blueprint.svg';

// Utils
import { getDesignList } from '../../utils/Request';

// Components
import ListFileItem from './components/ListFileItem';

// Antd components
import { PlusOutlined, FolderOpenOutlined, CloudOutlined } from '@ant-design/icons';
import { Button, Result, List, Spin, Typography, Space, Card, Row, Col, Empty, Input, Modal } from 'antd';

// Images
import bg from '../../assets/library_bg.png';
import loading from '../../assets/loading.svg';
import cloud from '../../assets/cloud.svg';
import local from '../../assets/localfile.svg';
import pin from '../../assets/pin.svg';

// Hooks
import { useCreateDesignModel } from './hooks/showCreatModal';
import useDesignList from './hooks/useDesignList';
import useIndexedDB from '../../hooks/useIndexedDB';
import useCircuitLoader from './hooks/useCircuitLoader';

function Loading(props) {
    return (
        <div className={libraryStyle.listLoading}>
            <img alt='' src={loading} />
        </div>
    );
}

function ListHeader(props) {
    const { header, icon } = props;

    return (
        <div className={libraryStyle.title}>
            <img alt='' src={icon}></img>
            <h2>{header}</h2>
        </div>
    );
}

function ListError(props) {
    const { text, reloader } = props;

    return (
        <Result status='error' title='Error!' subTitle={<span>{text} <a onClick={() => { reloader() }}>Reload</a></span>} />
    );
}

function Library(props) {
    const navigate = useNavigate();

    // const [designList, designListStatus] = useDesignList();

    const [modal, showModal] = useCreateDesignModel();

    const [db, dbLoaded] = useIndexedDB();

    const [lcoalFiles, setLocalFiles] = useState([]);

    // query all opened local file records and update localFiles state
    const updateLocalFileList = () => {
        let tempFiles = [];
        const request = db
            .transaction('localFileHandlers', 'readwrite')
            .objectStore('localFileHandlers')
            .openCursor();
        request.onsuccess = (ev) => {
            const cursor = ev.target.result;
            if (cursor) {
                const { value } = cursor;
                tempFiles.push(value);
                cursor.continue();
            } else {
                setLocalFiles(tempFiles);
            }
        };
    };

    useEffect(() => {
        if (dbLoaded) {
            updateLocalFileList();
        }
    }, [dbLoaded]);

    // Cloud
    // const listLoading = <Loading />;
    // const listError = <ListError text='Sorry. We can not load your files now.' reloader={() => { window.location.reload() }} />;
    // const cloudListHeader = <ListHeader header='Cloud' icon={cloud} />;
    // const cloudListFooter = [<Button shape='round' icon={<CloudOutlined />} type='primary' disabled={designListStatus != 'success'} onClick={addDesign}>New File</Button>];

    // const cloudListContent = designList.map((item, index) => {
    //     const handleClick = async (ev) => {
    //         navigate('/editor', {
    //             state: {
    //                 source: 'cloud',
    //                 filename: item.filename
    //             }
    //         });
    //     };
    //     return (
    //         <ListFileItem key={index} fileName={item.filename} editTime={item.lastEdit} onClick={handleClick} />
    //     );
    // });

    // Local
    const localListContent = lcoalFiles.map((item, index) => {
        const { _id, handler, name, lastEdit } = item;

        const onClick = (ev) => {
            handler.requestPermission().then((res) => {
                if (res === 'granted') {
                    navigate('/editor', {
                        state: {
                            source: 'local',
                            filename: item.name,
                            _id: item._id
                        }
                    });
                }
            });
        };

        const onDelete = (ev) => {
            console.log('delete file', name);
            const request = db
                .transaction('localFileHandlers', 'readwrite')
                .objectStore('localFileHandlers')
                .delete(_id);
            request.onsuccess = (res) => {
                updateLocalFileList();
            };
            request.onerror = (res) => {
                console.log('delete failed', res);
            };
        };

        return <ListFileItem key={_id} fileName={name} editTime={lastEdit} onClick={onClick} onDelete={onDelete} />
    });
    const localListHeader = <ListHeader header='Local' icon={local} />;

    // local file and IndexDB operations
    // open a local file and add filename, last modified time and handler to IndexDB
    async function openLocal() {
        let handler;
        let file;
        try {
            // Open file picker and check premission of the file
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
            handler = handlers[0];
            if (await handler.queryPermission({}) === 'granted') {
                file = await handler.getFile();
            }
        } catch (e) {
            return;
        }
        const request = db
            .transaction('localFileHandlers', 'readwrite')
            .objectStore('localFileHandlers')
            .add({
                handler: handler,
                name: handler.name,
                lastEdit: file.lastModified
            });
        request.onsuccess = (ev) => {
            console.log('add a local file:', handler.name);
            updateLocalFileList();
        };
    }

    const localActions = [
        // <Button shape='round' icon={<PlusOutlined />} type='ghost' onClick={addDesign}>New File</Button>,
        <Button shape='round' icon={<FolderOpenOutlined />} type='primary' onClick={openLocal}>Open File</Button>
    ];

    // Pin
    const pinListHeader = <ListHeader header='Pin' icon={pin} />;

    function addDesign(ev) {
        showModal();
    }

    // inline style
    const cardStyle = { border: '1px solid #D6D6D6', overflow: 'hidden' };
    const cardBodyStyle = (height) => {
        return {
            padding: 0,
            height
        };
    };

    return (
        <div className={libraryStyle.library} style={{ height: window.innerHeight - 52 }}>
            <Row justify='start' style={{ height: '100%' }}>
                <Col span={8} style={{margin: 'auto 30px'}}>
                    {/* <Card type='inner' title={cloudListHeader} actions={cloudListFooter} size='small' style={cardStyle} bodyStyle={cardBodyStyle((window.innerHeight - 402) / 2)}>
                        <div className={libraryStyle.listScroller}>
                            {designListStatus === 'fail' ? listError : null}
                            {designListStatus === 'success' ? cloudListContent : null}
                            {designListStatus === 'loading' ? listLoading : null}
                        </div>
                    </Card> */}
                    <Card type='inner' title={localListHeader} actions={localActions} size='small' style={cardStyle} bodyStyle={cardBodyStyle((window.innerHeight - 242))}>
                        <div className={libraryStyle.listScroller}>
                            {localListContent}
                        </div>
                    </Card>
                </Col>
                <Col flex='auto' style={{ margin: 'auto 30px auto 0' }}>
                    <Card type='inner' title={pinListHeader} size='small' style={cardStyle} bodyStyle={cardBodyStyle((window.innerHeight - 186))}>
                        <div className={libraryStyle.listScroller} 
                            onDrop={(ev) => {
                                console.log('drop', ev)
                            }}
                            onDragOver={(ev) => {ev.preventDefault();}}>
                            {/* <Empty style={{ marginTop: 200 }} /> */}
                        </div>
                    </Card>
                </Col>
            </Row>
            {modal}
        </div>
    );
}

export default Library;