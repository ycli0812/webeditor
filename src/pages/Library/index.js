import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';

// Style
import libraryStyle from './Library.module.css';

// Images
import blueprint from '../../assets/blueprint.svg';

// Utils
import { getDesignList } from '../../utils/Request';

function ListItem(props) {
    const {
        fileName,
        editTime,
        onClick
    } = props;

    return (
        <div className={libraryStyle.design} onClick={onClick}>
            <img alt='' src={blueprint}></img>
            <div className={libraryStyle.filename}>{fileName}</div>
            <div className={libraryStyle.editTime}>{editTime}</div>
        </div>
    );
}

function Library(props) {
    const navigate = useNavigate();

    const [designList, setDesignList] = useState([]);

    // 向服务器请求
    useEffect(() => {
        getDesignList().then((res) => {
            console.log(res);
            setDesignList(res.data);
        }).catch((res) => {
            setDesignList([{
                filename: 'network_error_default_file.json',
                editTime: '2023-01-01'
            }]);
        });
    }, []);

    const designs = designList.map((item, index) => {
        return (
            <ListItem key={index} fileName={item.filename} editTime={item.editTime} onClick={() => {navigate('/editor/' + item.filename)}} />
        );
    });

    return (
        <div className={libraryStyle.library}>
            <div className={libraryStyle.title}>
                <div className={libraryStyle.titleText}>我的设计</div>
            </div>
            <div className={libraryStyle.designList}>
                {designs}
            </div>
        </div>
    );
}

export default Library;