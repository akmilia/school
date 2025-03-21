import React, { useState } from 'react';
import styles from './AddUserModal.module.css';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [paternity, setPaternity] = useState('');
    const [gender, setGender] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [role_id, setRoleId] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userData = {
            surname,
            name,
            paternity,
            gender,
            birthdate: new Date(birthdate).toISOString(),
            login,
            password,
            role_id: Number(role_id),
        };
        onSubmit(userData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Добавить пользователя</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Фамилия:</label>
                        <input
                            type="text"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Имя:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Отчество:</label>
                        <input
                            type="text"
                            value={paternity}
                            onChange={(e) => setPaternity(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Пол:</label>
                        <input
                            type="text"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Дата рождения:</label>
                        <input
                            type="date"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Логин:</label>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Пароль:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Роль:</label>
                        <select
                            value={role_id}
                            onChange={(e) => setRoleId(e.target.value)}
                            required
                        >
                            <option value={1}>Администратор</option>
                            <option value={2}>Преподаватель</option>
                            <option value={3}>Ученик</option>
                        </select>
                    </div>
                    <div className={styles.buttons}>
                        <button type="button" onClick={onClose}>Отмена</button>
                        <button type="submit">Добавить</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;