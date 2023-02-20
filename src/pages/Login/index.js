import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';

// Style
import loginStyle from './Login.module.css';
// import fancyInputStyle from './FancyInput.module.css';

// Antd components
import { Input, Space, Button, message } from 'antd';

// Redux actions
import { login } from '../../app/globalSlice';

// Components
import FancyInput from '../../components/FancyInput';

// Images
// import login_bg from '../../assets/login_bg.jpg';

function Login(props) {
    const dispatch = useDispatch();
    const nav = useNavigate();

    // const { logined } = useSelector(state => state.global);
    useEffect(() => {
        const userName = Cookies.get('user');
        console.log('Login effect');
        if(userName !== undefined) {
            dispatch(login(true));
            console.log('Login nav to library');
            nav('/library');
        }
    }, []);

    const handleLogin = (ev) => {
        message.info({
            content: 'Backend interface not done yet. Account will not be checked.',
            duration: 2
        });
        Cookies.set('user', 'test_user');
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