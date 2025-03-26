import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    email: string;
    banned: boolean;
    banReason: string | null;
}

const UserTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);

            try {
                const response = await axios.get('/users');
                setUsers(response.data);
                setError('');
            } catch (error: any) {
                console.error('Ошибка при загрузке пользователей:', error);

                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }

                setError('Ошибка при загрузке пользователей');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return <div className="loader">Загрузка...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="user-table-container">
            <div className="header">
                <h2>Список пользователей</h2>
                <button onClick={handleLogout} className="logout-button">Выйти</button>
            </div>

            <div className="user-count">
                Всего пользователей: <span className="badge">{users.length}</span>
            </div>

            <div className="table-container">
                <table className="user-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Статус</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="empty-message">Пользователей не найдено</td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>
                    <span className={user.banned ? "status-banned" : "status-active"}>
                      {user.banned ? 'Заблокирован' : 'Активен'}
                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;