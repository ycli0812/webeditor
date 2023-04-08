import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

// Style
import outputBarStyle from './OutputBar.module.css';

// Antd
import { Button, Space, Divider, Tooltip, ConfigProvider, message } from 'antd';
import { InfoCircleFilled, CloseCircleFilled, ExclamationCircleFilled, CheckCircleFilled, CheckOutlined, CloseOutlined, ClearOutlined, FileAddOutlined, SettingOutlined, FilterOutlined } from '@ant-design/icons';

// Utils
import { readCircuitFromFile, requestVerify, requestVerificationResult } from './verify.ts';

// Types
interface OutputItemProps {
    type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS',
    elementId: string[],
    text: string
};


function OutputItem(props: OutputItemProps) {
    const { type, elementId, text } = props;

    const infoClass = {
        INFO: outputBarStyle.normalInfo + ' ' + outputBarStyle.info,
        WARNING: outputBarStyle.warningInfo + ' ' + outputBarStyle.info,
        ERROR: outputBarStyle.errorInfo + ' ' + outputBarStyle.info,
        SUCCESS: outputBarStyle.successInfo + ' ' + outputBarStyle.info
    }[type];

    const icon = {
        INFO: <InfoCircleFilled style={{ color: '#AFAFAF', fontSize: 12 }} />,
        WARNING: <ExclamationCircleFilled style={{ color: '#FFB833', fontSize: 12 }} />,
        ERROR: <CloseCircleFilled style={{ color: '#C42B1C', fontSize: 12 }} />,
        SUCCESS: <CheckCircleFilled style={{ color: '#0B8235', fontSize: 12 }} />
    }[type];

    return (
        <div className={infoClass}>
            <span className={outputBarStyle.icon}>{icon}</span>
            <span className={outputBarStyle.outText}>{text}</span>
        </div>
    );
}

function OutputBar(props: never) {
    const [verifyRunning, setVerifyRunning] = useState(false);
    const [output, setOutput] = useState([]);
    const [sampleFileName, setSampleFileName] = useState('Select file');
    const [sampleFileContent, setSampleFileContent] = useState(null);
    const [taskToken, setTaskToken] = useState(null);

    const { circuit } = useSelector((state: any) => state.editor);
    
    const [msg, msgHandler] = message.useMessage();

    const queryResult = (token: any, count: number) => {
        setTimeout(() => {
            requestVerificationResult(token)
            .then((res: any) => {
                if(res.data.status === 'PENDING') {
                    queryResult(token, count - 1);
                } else {
                    setVerifyRunning(false);
                    setOutput(JSON.parse(res.data.result));
                    msg.success('Verification done.');
                }
            })
            .catch((res: any) => {
                setVerifyRunning(false);
            });
        }, 2000);
    };

    const runVerification = (ev: React.MouseEvent) => {
        if(sampleFileContent === null) {
            msg.error('You have to select a sample circuit before verifying.');
            return;
        }
        setVerifyRunning(true);
        requestVerify(sampleFileContent, JSON.stringify(circuit))
        .then((res: any) => {
            if(res.data.token !== undefined) {
                setTaskToken(res.data.token);
                setOutput([]);
                queryResult(res.data.token, 3);
            }
        })
        .catch((res: any) => {
            console.log('verify error: ', res);
            setVerifyRunning(false);
            msg.error('Something went wrong...');
        });
    };

    const abortVerification = (ev: React.MouseEvent) => {
        setVerifyRunning(false);
    };

    const clearConsole = (ev: React.MouseEvent) => {
        setOutput([]);
    };

    const selectSampleFile = async (ev: React.MouseEvent) => {
        try {
            const [name, content] = await readCircuitFromFile();
            setSampleFileName(name);
            setSampleFileContent(content);
        } catch(e) {
            console.log('load sample file failed', e);
        }
    };

    return (
        <div className={outputBarStyle.container}>
            <div className={outputBarStyle.header}>
                <Button onClick={selectSampleFile} disabled={verifyRunning} size="small" icon={<FileAddOutlined style={{ color: '#666666' }} />} type='dashed' shape='round'>{sampleFileName}</Button>
                <Divider type='vertical' />
                <Space direction='horizontal' size={3}>
                    <Tooltip title='Run Verification'>
                        <Button loading={verifyRunning}
                            onClick={runVerification}
                            icon={<CheckOutlined style={{ color: '#0B8235' }} />}
                            size='small'
                            shape='circle'
                            type='text'></Button>
                    </Tooltip>
                    <Tooltip title='Abort Verification'>
                        <Button disabled={!verifyRunning}
                            onClick={abortVerification}
                            icon={<CloseOutlined style={{ color: verifyRunning ? '#C42B1C' : '#BBBBBB' }} />}
                            size='small'
                            shape='circle'
                            type='text'></Button>
                    </Tooltip>
                    <Tooltip title='Clear Outputs'>
                        <Button onClick={clearConsole} icon={<ClearOutlined />} size='small' shape='circle' type='text'></Button>
                    </Tooltip>
                    <Tooltip title='Verification Settings'>
                        <Button icon={<SettingOutlined />} size='small' shape='circle' type='text'></Button>
                    </Tooltip>
                    <Tooltip title='Output Filter'>
                        <Button icon={<FilterOutlined />} size='small' shape='circle' type='text'></Button>
                    </Tooltip>
                </Space>
            </div>
            <div className={outputBarStyle.list}>
                {output.map((item: any, index) => <OutputItem type={item.type} elementId={item.involvedElementIds} text={item.formatString} key={index} />)}
            </div>
            {msgHandler}
        </div>
    );
}

export default OutputBar;