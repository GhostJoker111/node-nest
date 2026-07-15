import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

jest.mock('axios', () => ({
    post: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>,
}));

const axios = jest.requireMock('axios');

const fillAndSubmit = (email: string, password: string) => {
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } });
    fireEvent.change(screen.getByLabelText('Пароль'), { target: { value: password } });
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
};

describe('LoginForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('рендерит форму: заголовок, поля, кнопку', () => {
        render(<LoginForm />);

        expect(screen.getByText('Вход в систему')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Войти' })).toBeInTheDocument();
    });

    it('успешный вход: шлёт запрос, сохраняет токен, ведёт на /users', async () => {
        axios.post.mockResolvedValue({ data: { token: 'jwt-token-123' } });
        render(<LoginForm />);

        fillAndSubmit('user@test.com', 'qwerty123');

        expect(await screen.findByRole('button', { name: 'Войти' })).toBeEnabled();

        expect(axios.post).toHaveBeenCalledWith('/auth/login', {
            email: 'user@test.com',
            password: 'qwerty123',
        });
        expect(localStorage.getItem('token')).toBe('jwt-token-123');
        expect(mockNavigate).toHaveBeenCalledWith('/users');
    });

    it('ошибка входа: показывает сообщение сервера, не редиректит', async () => {
        axios.post.mockRejectedValue({
            response: { data: { message: 'Некорректный email или пароль' } },
        });
        render(<LoginForm />);

        fillAndSubmit('user@test.com', 'wrong');

        expect(await screen.findByText('Некорректный email или пароль')).toBeInTheDocument();
        expect(localStorage.getItem('token')).toBeNull();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
