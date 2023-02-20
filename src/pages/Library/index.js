import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';

// Style
import libraryStyle from './Library.module.css';

// Images
import blueprint from '../../assets/blueprint.svg';

// Utils
import { getDesignList } from '../../utils/Request';

// Antd components
import { PlusOutlined } from '@ant-design/icons';
import { Button, Result, List, Spin, Typography, Space } from 'antd';

// Hooks
import { useCreateDesignModel } from './hooks/showCreatModal';

function useDesignList() {
    const [designList, setDesignList] = useState([]);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        getDesignList().then((res) => {
            console.log(res);
            setTimeout(() => {
                setDesignList(res.data);
                setStatus('success');
            }, 1000);
        }).catch((res) => {
            console.error('Can not load files.');
            setStatus('fail');
        });
    }, []);

    return [designList, status];
}

function ListItem(props) {
    const {
        fileName,
        editTime,
        onClick
    } = props;

    const d = new Date(editTime);
    console.log(d);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    return (
        <List.Item className={libraryStyle.design} onClick={onClick}>
            <Space direction='vertical' size={5}>
                <Typography.Text strong style={{ fontSize: 18 }}>{fileName}</Typography.Text>
                <Typography.Text type='secondary'>{dateStr}</Typography.Text>
            </Space>
        </List.Item>
    );
}

function Library(props) {
    const navigate = useNavigate();

    const [designList, designListStatus] = useDesignList();

    const [modal, showModal] = useCreateDesignModel();

    const listContent = designList.map((item, index) => {
        return (
            <ListItem key={index} fileName={item.filename} editTime={item.lastEdit} onClick={() => { navigate('/editor/' + item.filename) }} />
        );
    });

    const listLoading = (
        <div className={libraryStyle.listLoading}>
            <Spin />
        </div>
    );

    const listError = (
        <Result status='error' title='Error!' subTitle={<span>Sorry. We can not load your files now. <a onClick={() => {window.location.reload()}}>Reload</a></span>} />
    );

    const listHeader = (
        <div className={libraryStyle.title}>
            <img alt='' src={blueprint}></img>
            <div className={libraryStyle.titleText}>My Designs</div>
        </div>
    );

    const listFooter = designListStatus === 'success' ? (
        <div className={libraryStyle.listFooter}>
            <Button shape='round' icon={<PlusOutlined />} type='dashed' onClick={addDesign}>New File</Button>
        </div>
    ) : null;

    function addDesign(ev) {
        showModal();
    }

    return (
        <div className={libraryStyle.library}>
            <div>
                <List size='small' bordered split header={listHeader} footer={listFooter}>
                    {designListStatus === 'fail' ? listError : null}
                    {designListStatus === 'success' ? listContent : null}
                    {designListStatus === 'loading' ? listLoading : null}
                </List>
            </div>
            {modal}
        </div>
    );
}

export default Library;