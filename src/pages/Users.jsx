import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeaderAdmin from '../components/estaticos/HeaderAdmin';
import Footer from '../components/estaticos/Footer';
import './Users.css';
import loading_img from '../assets/loading.gif'
import { useUsers } from '../context/UsersContext';

const Users = () => {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [normalizedUsers, setNormalizedUsers] = useState([]); // Nuevo estado para usuarios normalizados
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    const { users, loading, deleteUser } = useUsers();

    // Normaliza los usuarios cuando cambian
    useEffect(() => {
        if (Array.isArray(users)) {
            const normalized = users.map(user => ({
                id: user.id || user.ID,
                name: user.name || user.Name || '',
                email: user.email || user.Email || '',
                roles: (user.roles || user.Roles || []).map(role => ({
                    id: role.id || role.ID,
                    name: role.name || role.Name || '',
                })),
            }));
            setNormalizedUsers(normalized);
        }
    }, [users]);

    // Filtra los usuarios normalizados según el searchTerm
    useEffect(() => {
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = normalizedUsers.filter(user =>
            user.email.toLowerCase().includes(searchTermLower) ||
            user.name.toLowerCase().includes(searchTermLower) ||
            user.roles.some(role => role.name.toLowerCase().includes(searchTermLower))
        );
        setFilteredUsers(filtered);
    }, [searchTerm, normalizedUsers]);

    const handleDelete = async (userId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            const success = await deleteUser(userId);
            if (success) {
                alert('Usuario eliminado correctamente');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement user update/create
        setShowModal(false);
    };

    return (
        <>
            <div className="admin-page">
                <HeaderAdmin />
                <main className="main-content">
                    <div className="header-container">
                        <h1 className="main-title">
                            <i className="fa-solid fa-users" style={{ marginRight: "0.5em" }}></i>
                            Usuarios
                        </h1>
                        <div className="header-buttons">
                            <Link to="/admin" className="back-button">
                                <i className="fa-solid fa-arrow-left"></i>
                                Volver al Admin
                            </Link>
                        </div>
                    </div>
                    {/* Barra de búsqueda */}
                    <div className="search-container">
                        <div className="search-box">
                            <i className="fa-solid fa-search search-icon"></i>
                            <input
                                type="text"
                                placeholder="Buscar usuarios..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            {searchTerm && (
                                <button
                                    className="clear-search"
                                    onClick={() => setSearchTerm('')}
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <img src={loading_img} alt="Cargando..." className="loading-img" />
                    ) : (
                        <div className="users-list">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>Nombre</th>
                                        <th>Rol</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.email || user.Email}</td>
                                                <td>{user.name || user.Name || user.email || user.Email}</td>
                                                <td>
                                                    {user.roles ? user.roles.map(role => {
                                                        return (
                                                            <span key={role.id} className="role-badge">
                                                                {role.name}
                                                            </span>
                                                        );
                                                    }) : 'No roles'}
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="action-button edit-button icon-button"
                                                            onClick={() => {
                                                                setUserData({
                                                                    name: user.name || user.Name || '',
                                                                    email: user.email || user.Email || '',
                                                                    password: '', // Por seguridad, deja vacío
                                                                    role: user.Roles && user.Roles[0] ? user.Roles[0].name : 'user'
                                                                });
                                                                setIsEditing(true);
                                                                setShowModal(true);
                                                            }}
                                                        >
                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                        </button>
                                                        <button
                                                            className="action-button delete-button icon-button"
                                                            onClick={() => handleDelete(user.id || user.ID)}
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                                {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios disponibles'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                            Total de usuarios: {filteredUsers.length}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>

                            {showModal && (
                                <div className="modal">
                                    <div className="modal-content">
                                        <h2>{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                                        <form onSubmit={handleSubmit}>
                                            <div className="form-group">
                                                <label htmlFor="name">Nombre</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    className="form-control"
                                                    value={userData.name}
                                                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Email</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    className="form-control"
                                                    value={userData.email}
                                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="password">Contraseña</label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    className="form-control"
                                                    value={userData.password}
                                                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="role">Rol</label>
                                                <select
                                                    id="role"
                                                    className="form-control"
                                                    value={userData.role}
                                                    onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                                                >
                                                    <option value="user">Usuario</option>
                                                    <option value="admin">Administrador</option>
                                                </select>
                                            </div>
                                            <div className="modal-buttons">
                                                <button
                                                    type="button"
                                                    className="cancel-button"
                                                    onClick={() => setShowModal(false)}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="save-button"
                                                >
                                                    Guardar
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </main>
                <Footer />
            </div>
        </>
    );
};

export default Users;

