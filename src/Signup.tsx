'use client';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import './assets/user.css';

type Inputs = {
  email: string;
  password: string;
  password_confirmation: string;
};

const Signup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setError, formState: { errors } } = useForm<Inputs>();
  const password = watch("password");

  const onSubmit = async (data: Inputs) => {
    try {
      console.log('リクエストデータ:', data);

      const response = await fetch("/users", {
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

      const responseData = await response.json().catch(e => null);
      console.log('レスポンス:', response.status, responseData);

      if (response.ok) {
        const accessToken = response.headers.get('access-token');
        const client = response.headers.get('client');
        const uid = response.headers.get('uid');

        console.log('認証情報:', {
          'Access-Token': accessToken,
          'Client': client,
          'Uid': uid
        });

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
        if (responseData?.status?.errors) {
          setError('email', {
            type: 'manual',
            message: responseData.status.errors.join(', ')
          });
        }
      }
    } catch (error) {
      console.error("通信エラーの詳細:", error);
      setError('email', {
        type: 'manual',
        message: '通信エラーが発生しました。しばらく経ってからお試しください。'
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2 className="auth-title">アカウント作成</h2>
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

          <div className="form-group">
            <label className="auth-label">パスワード（確認）</label>
            <input
              {...register("password_confirmation", {
                required: "パスワード（確認）は必須です",
                validate: value =>
                  value === password || "パスワードが一致しません"
              })}
              type="password"
              className="auth-input"
            />
            {errors.password_confirmation && (
              <span className="error-message">{errors.password_confirmation.message}</span>
            )}
          </div>

          <button type="submit" className="auth-button">
            アカウント作成
          </button>

          <div className="text-center mt-4">
            <Link to="/signin" className="auth-link">
              既にアカウントをお持ちの方はこちら
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
