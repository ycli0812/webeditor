import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Style
import navbarStyle from './Navbar.module.css';

// Images
import list from '../../assets/list.svg';

// Utils
import { saveDesign } from '../../utils/Request';

// Redux actions
import { setModified } from '../../pages/Editor/slices/editorSlice';

// Antd components
import { Button, Modal, Space, message } from 'antd';

// Hooks
function useConfirmQuitModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState();

    const navigateTo = useNavigate();

    const {circuit} = useSelector(state => state.editor);
    const filename = useLocation().pathname.split('/')[2];

    const handleSave = (ev) => {
        console.log('save');
        setLoading(true);
        
        saveDesign(filename, circuit).then((res) => {
            setLoading(false);
            setOpen(false);
            navigateTo('/library');
        }).catch((res) => {
            console.error('Save design error:', res);
            setLoading(false);
            setOpen(false);
            message.error('Save failed.');
        });
    };

    const handleCancel = (ev) => {
        setOpen(false);
    };

    const handleQuit = (ev) => {
        setOpen(false);
        navigateTo('/library');
    };

    useEffect(() => {
        setModal(
            <Modal
                open={open}
                title='Warning'
                footer={(
                    <Space>
                        <Button key='submit' type='primary' onClick={handleSave} loading={loading}>Save</Button>
                        <Button key='nosave' type='primary' danger onClick={handleQuit} disabled={loading}>Quit anyway</Button>
                        <Button key='cancel' slot='back' onClick={handleCancel} disabled={loading}>Cancel</Button>
                    </Space>
                )}
                keyboard={false}>
                File not saved yet, are you sure to quit?
            </Modal>
        );
    }, [open, loading]);

    const showModal = () => {
        setOpen(true);
    };

    return [modal, showModal];
}

function Navbar(props) {
    const dispatch = useDispatch();
    const navTo = useNavigate();
    // const { filename } = useParams();
    const filename = useLocation().pathname.split('/')[2];
    const { modified } = useSelector(state => state.editor);

    const [quitConfirmModal, showQuitConfirmModal] = useConfirmQuitModal();

    function toLibrary(ev) {
        if (modified) {
            console.log('try to quit when modified');
            showQuitConfirmModal();
        } else {
            navTo('/library');
        }
    }

    return (
        <div className={navbarStyle.navbar}>
            <img alt='' src={list} draggable={false} onClick={toLibrary}></img>
            <div className={navbarStyle.title}>
                <span className={navbarStyle.folderName}>{filename === undefined ? '首页' : '我的设计'}/</span>
                <span className={navbarStyle.fileName}>{filename === undefined ? '' : decodeURI(filename)}</span>
                <span className={navbarStyle.fileName}>{modified ? '*' : ''}</span>
                {quitConfirmModal}
            </div>
        </div>
    );
}

export default Navbar;