'use client';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './assets/user.css';

type Inputs = {
    email: string;
    password: string;
};

const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setError, formState: { errors } } = useForm<Inputs>();

    const onSubmit = async (data: Inputs) => {
        try {
            const response = await fetch("/users/sign_in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    user: data,
                }),
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                const accessToken = response.headers.get('access-token');
                const client = response.headers.get('client');
                const uid = response.headers.get('uid');

                if (accessToken && client && uid) {
                    localStorage.setItem('access-token', accessToken);
                    localStorage.setItem('client', client);
                    localStorage.setItem('uid', uid);
                }

                await fetch('/api/v1/todos', {
                    headers: {
                        'access-token': accessToken || '',
                        'client': client || '',
                        'uid': uid || '',
                    }
                });

                navigate('/api/v1/todos');
            } else {
                const errorData = await response.json();
                setError('email', {
                    type: 'manual',
                    message: 'メールアドレスまたはパスワードが間違っています'
                });
            }
        } catch (error) {
            console.error("通信エラー:", error);
            setError('email', {
                type: 'manual',
                message: '通信エラーが発生しました。しばらく経ってからお試しください。'
            });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-container">
                <h2 className="auth-title">ログイン</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label className="auth-label">メールアドレス</label>
                        <input
                            {...register("email", {
                                required: "メールアドレスは必須です",
                                pattern: {
                                    value: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                                    message: "このメールアドレスは無効です。",
                                },
                            })}
                            type="email"
                            className="auth-input"
                            placeholder="mail@example.com"
                        />
                        {errors.email && (
                            <span className="error-message">{errors.email.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="auth-label">パスワード</label>
                        <input
                            {...register("password", {
                                required: "パスワードは必須です",
                                minLength: {
                                    value: 8,
                                    message: "パスワードは8文字以上でなくてはなりません",
                                },
                            })}
                            type="password"
                            className="auth-input"
                        />
                        {errors.password && (
                            <span className="error-message">{errors.password.message}</span>
                        )}
                    </div>

                    <button type="submit" className="auth-button">
                        ログイン
                    </button>

                    <div className="text-center mt-4">
                        <Link to="/signup" className="auth-link">
                            アカウントをお持ちでない方はこちら
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
