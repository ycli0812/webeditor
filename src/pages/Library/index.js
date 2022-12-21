import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';

// Style
import libraryStyle from './Library.module.css';

// Images
import blueprint from '../../res/blueprint.svg';

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
    // 向服务器请求
    return (
        <div className={libraryStyle.library}>
            <div className={libraryStyle.title}>
                <div className={libraryStyle.titleText}>我的设计</div>
            </div>
            <div className={libraryStyle.designList}>
                {/* <div className={libraryStyle.design}>
                    <img alt='' src={blueprint}></img>
                    <div className={libraryStyle.filename}>文件名</div>
                    <div className={libraryStyle.editTime}>2022-12-21 00:12:57</div>
                </div> */}
                <ListItem fileName='design1' editTime='2022-12-21 00:12:57' onClick={() => {navigate('/editor/design1')}} />
                <ListItem fileName='design2' editTime='2022-12-21 00:12:57' onClick={() => {navigate('/editor/design2')}} />
                <ListItem fileName='design3' editTime='2022-12-21 00:12:57' onClick={() => {navigate('/editor/design3')}} />
            </div>
        </div>
    );
}

export default Library;