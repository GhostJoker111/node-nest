import React from 'react';
import { render, screen } from '@testing-library/react';
import UserTable from './UserTable';

jest.mock('axios', () => ({
    get: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

const axios = jest.requireMock('axios');

describe('UserTable', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('сначала показывает лоадер, потом таблицу с пользователями', async () => {
        axios.get.mockResolvedValue({
            data: [
                { id: 1, email: 'first@test.com', banned: false, banReason: null },
                { id: 2, email: 'second@test.com', banned: true, banReason: 'спам' },
            ],
        });
        render(<UserTable />);

        expect(screen.getByText('Загрузка...')).toBeInTheDocument();
        expect(await screen.findByText('first@test.com')).toBeInTheDocument();
        expect(screen.getByText('second@test.com')).toBeInTheDocument();
        expect(screen.getByText('Заблокирован')).toBeInTheDocument();
        expect(screen.getByText('2', { selector: '.badge' })).toBeInTheDocument();
    });

    it('при 401 удаляет токен и уводит на /login', async () => {
        localStorage.setItem('token', 'expired-token');
        axios.get.mockRejectedValue({ response: { status: 401 } });
        render(<UserTable />);

        expect(await screen.findByText('Ошибка при загрузке пользователей')).toBeInTheDocument();
        expect(localStorage.getItem('token')).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('пустой список: показывает заглушку', async () => {
        axios.get.mockResolvedValue({ data: [] });
        render(<UserTable />);

        expect(await screen.findByText('Пользователей не найдено')).toBeInTheDocument();
    });
});
