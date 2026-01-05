import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginCredentials } from '@/hooks/use-auth/types';
import { Input } from 'antd';
import { authService } from '@/api/authAPI';
import { antdUtils } from '@/utils/antd';
import { useConfigStore } from '@/stores';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const { setToken, setRefreshToken } = useConfigStore()

    const from = '/dashboard';

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const newUser: LoginCredentials = { username: username, password: password }
        try {
            const data = await authService.login(newUser);
            setToken(data.token)
            setRefreshToken(data.refreshToken)
            navigate(from, { replace: true })
        }
        catch (error) {
            antdUtils.message.error({ 'content': '' + error })
        }
    };

    return (
        <div className="login">
            <div className='flex justify-center items-center h-[100vh]'>
                <div className='flex justify-center'>
                    <div className="dark:bg-[rgb(33,41,70)] w-[400px] px-[32px] py-[20px] mt-[-12%] bg-white rounded-lg">
                        <form className="space-y-6" onSubmit={handleSubmit} method="POST">
                            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                                <div className="mt-2"><Input id="username"
                                    name="username"
                                    autoComplete="username"
                                    required
                                    className=''
                                    placeholder="用户名" value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={status === 'loading'} /></div>
                                <div className="mt-2">
                                    <Input.Password
                                        id="password"
                                        name="password"
                                        autoComplete="current-password"
                                        required
                                        className=""
                                        placeholder="密码"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={status === 'loading'}
                                    />
                                </div>
                            </div>
                            {/* <div className="flex">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    记住我
                                </label>
                            </div> */}
                            <div>
                                <button type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                                //disabled={status === 'loading'}
                                >
                                    {status === 'loading' ? (
                                        <span className="flex items-center">
                                            登录中...
                                        </span>
                                    ) : (
                                        '登录'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;