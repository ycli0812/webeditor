import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';

// Style
import listFileItemStyle from './ListFileItem.module.css';

// Antd components
import { List, Typography, Space, Row, Col, Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

function ListFileItem(props) {
    const {
        fileName,
        editTime,
        onClick,
        onDelete = (ev) => { },
        onRename = (ev) => { }
    } = props;

    const [optionsOpacity, setOptionsOpacity] = useState(0);

    const d = new Date(editTime);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    const onClickDelete = (ev) => {
        ev.stopPropagation();        
        onDelete(ev);
    };

    const onClickRename = (ev) => {
        ev.stopPropagation();
        onRename(ev);
    };

    return (
        <div className={listFileItemStyle.design} onClick={onClick} onMouseEnter={() => setOptionsOpacity(1)} onMouseLeave={() => setOptionsOpacity(0)}
            draggable 
            // onDrag={(ev) => {console.log('drag')}}
            onDragStart={(ev) => {
                console.log('dragstart', ev);
                ev.detail = {
                    fileName
                };
            }}
        >
            <Row align='middle' style={{ flex: 1 }}>
                <Col flex={'auto'}>
                    <Space direction='vertical' size={0}>
                        <Typography.Text strong style={{ fontSize: 18 }}>{fileName}</Typography.Text>
                        <Typography.Text type='secondary'>{dateStr}</Typography.Text>
                    </Space>
                </Col>
                <Col>
                    <Space direction='horizantal' size={1} style={{ opacity: optionsOpacity, transition: '0.2s' }}>
                        <Button size='small' shape='circle' onClick={onClickRename} icon={<EditOutlined style={{ color: '#777777' }} />} type='ghost' ></Button>
                        <Button size='small' shape='circle' onClick={onClickDelete} icon={<DeleteOutlined style={{ color: '#777777' }} />} type='ghost' ></Button>
                    </Space>
                </Col>
            </Row>
        </div>
    );
}

export default ListFileItem;