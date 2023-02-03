import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Input, Space, message } from "antd";
import { saveDesign } from "../../../utils/Request";

export function useCreateDesignModel() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inputName, setInputName] = useState('');
    const [modal, setModal] = useState();

    const navigateTo = useNavigate();

    const handleOk = (ev) => {
        console.log('save');
        setLoading(true);
        
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 2000);
        // saveDesign(inputName, {}).then((res) => {
        //     setLoading(false);
        //     setOpen(false);
        //     navigateTo('/editor/' + inputName + '.json');
        // }).catch((res) => {
        //     console.error('Save design error:', res);
        //     setLoading(false);
        //     setOpen(false);
        //     message.error('Save failed.');
        // });
    };

    const handleCancel = (ev) => {
        setOpen(false);
    };

    const handleChange = (ev) => {};

    useEffect(() => {
        setModal(
            <Modal
                open={open}
                title='Cerate new file'
                keyboard={false}
                confirmLoading={loading}
                cancelButtonProps={{disabled: loading}}
                onOk={handleOk}
                onCancel={handleCancel}>
                <Space direction='vertical'>
                    Please input the filename: (后台接口未完成)
                    <Input addonAfter='.json' onChange={handleChange}/>
                </Space>
            </Modal>
        );
    }, [open, loading]);

    const showModal = () => {
        setOpen(true);
    };

    return [modal, showModal];
}