import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirm) {
            setError('Пароли не совпадают');
            return;
        }

        setLoading(true);
        try {
            // бэкенд хэширует пароль и сразу возвращает токен (автологин после регистрации)
            const response = await axios.post('/auth/registration', { email, password });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/users');
            }
        } catch (error: any) {
            setError(
                error.response?.data?.message ||
                error.message ||
                'Произошла ошибка при регистрации'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-form">
            <h2 className="form-title">Регистрация</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Введите email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirm">Повторите пароль</label>
                    <input
                        type="password"
                        id="confirm"
                        placeholder="Повторите пароль"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                </button>
            </form>

            <p className="form-switch">
                Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
        </div>
    );
};

export default RegisterForm;