import { useEffect, useState } from 'react';

import './authPage.css';

export default function AuthPage({ router, updAuthToken, updBackgrColor, updNavShadow, updShadowOpacity, updNavBttnColor }) {
    const [login, updLogin] = useState('');
    const [password, updPassword] = useState('');

    useEffect(() => {
        updBackgrColor('#f7f7fa');
        updShadowOpacity(0);
        updNavBttnColor('#9b6fa3');
        updNavShadow(0.25);
    }, [])

    async function authHandler() {
        try {
            const authInfo = await router.auth({ login, password });
            const token = authInfo?.data?.token
            localStorage.setItem('maps-auth-token', token)
            updAuthToken(token);
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className='auth-container'>
            <div className='auth-interactive'>
                <input placeholder="Логин" onChange={(e) => { updLogin(e.currentTarget.value); }} />
                <input placeholder="Пароль" type="password" onChange={(e) => { updPassword(e.currentTarget.value); }} />
                <button onClick={authHandler}>Войти</button>
            </div>
        </div>

    );
}