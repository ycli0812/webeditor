import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Style
import loginStyle from './Login.module.css';
import fancyInputStyle from './FancyInput.module.css';

// Antd components
import { Input, Space, Button, message } from 'antd';

// Redux actions
import { login } from '../../app/globalSlice';

// Images
import login_bg from '../../assets/login_bg.jpg';

function FancyInput(props) {
    const {
        name,
        type,
        placeholder
    } = props;

    const [focused, setFocused] = useState(false);
    const [placeHolderClass, setPlaceholderClass] = useState(fancyInputStyle.placeholderBlured);
    const [isEmpty, setIsEmpty] = useState(true);

    const handleFocus = (ev) => {
        setFocused(true);
        setPlaceholderClass(fancyInputStyle.placeholderFocused);
    };

    const handleBlur = (ev) => {
        if (isEmpty) {
            setPlaceholderClass(fancyInputStyle.placeholderBlured);
        }
        setFocused(false);
    };

    const handleChange = (ev) => {
        console.log(ev);
        const { value } = ev.target;
        if (value == '') {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
        }
    }

    return (
        <div className={focused ? fancyInputStyle.containerFocused : fancyInputStyle.containerBlured}>
            <Input bordered={false} onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange} type={type} />
            <div className={placeHolderClass} style={{ color: focused ? '#1F66FF' : '#AAAAAA' }}>{placeholder}</div>
        </div>
    );
}

function Login(props) {
    const dispatch = useDispatch();
    const nav = useNavigate();

    const handleLogin = (ev) => {
        message.info({
            content: 'Backend interface not done yet. Account will not be checked.',
            duration: 2
        });
        dispatch(login(true));
        nav('/library');
    };

    const handleRegister = (ev) => {
        message.error({
            content: 'No registration page now.',
            duration: 2
        });
    };

    return (
        <div className={loginStyle.login}>
            <div id={loginStyle.bg} style={{ height: window.innerHeight }}>
                {/* <img alt='' src={login_bg}></img> */}
            </div>
            <section id={loginStyle.loginCard}>
                <Space align='center'>
                    <h2>Login Your Account</h2>
                </Space>
                <Space direction='vertical' size={20} style={{ display: 'flex' }}>
                    <FancyInput placeholder='Account' type='text' />
                    <FancyInput placeholder='Password' type='password' />
                </Space>
                <Space direction='horizontal' align='end' style={{ marginLeft: 'auto' }}>
                    <Button type='primary' size='large' shape='round' onClick={handleLogin}>Login</Button>
                    <Button type='link' size='large' onClick={handleRegister}>Register</Button>
                </Space>
            </section>
        </div>
    );
}

export default Login;