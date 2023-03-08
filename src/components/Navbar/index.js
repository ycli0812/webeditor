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
import { Button, Modal, Space, message, Breadcrumb } from 'antd';
import { HomeOutlined, CloudOutlined, FolderOutlined } from '@ant-design/icons';

// Hooks
function useConfirmQuitModal() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState();

    const navigateTo = useNavigate();

    const { circuit } = useSelector(state => state.editor);
    const filename = useLocation().pathname.split('/')[2];

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
                        <Button key='nosave' type='primary' danger onClick={handleQuit} disabled={loading}>Quit anyway</Button>
                        <Button key='cancel' slot='back' onClick={handleCancel} disabled={loading}>Cancel</Button>
                    </Space>
                )}
                keyboard={false}>
                The file is not saved yet, you will lost your modification if you quit now. Are you sure?
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
    const page = useLocation().pathname.split('/')[1];
    const { modified, filename, source } = useSelector(state => state.editor);

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
            {/* <img alt='' src={list} draggable={false} onClick={toLibrary}></img>
            <div className={navbarStyle.title}>
                <span className={navbarStyle.folderName}>{filename === undefined ? 'Home' : 'My Designs'}/</span>
                <span className={navbarStyle.fileName}>{filename === undefined ? '' : decodeURI(filename)}</span>
                <span className={navbarStyle.fileName}>{modified ? '*' : ''}</span>
                
            </div> */}
            <Breadcrumb>
                <Breadcrumb.Item onClick={toLibrary}>
                    <HomeOutlined style={{cursor: 'pointer'}} />
                </Breadcrumb.Item>
                {page === 'library' ?
                    <Breadcrumb.Item><span>Library</span></Breadcrumb.Item>
                    : null}
                {page === 'editor' ? [
                    <Breadcrumb.Item>
                        {source === 'cloud' ? [<CloudOutlined />, <span>Cloud</span>] : null}
                        {source === 'local' ? [<FolderOutlined />, <span>Local</span>] : null}
                    </Breadcrumb.Item>,
                    <Breadcrumb.Item>
                        <span>{filename + (modified ? '*' : '')}</span>
                    </Breadcrumb.Item>
                ] : null}
            </Breadcrumb>
            {quitConfirmModal}
        </div>
    );
}

export default Navbar;