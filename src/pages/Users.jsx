import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useUsers } from '../context/UsersContext';
import HeaderAdmin from '../components/estaticos/HeaderAdmin';
import Footer from '../components/estaticos/Footer';
import './Users.css';
import loading_img from '../assets/loading.gif'

const Users = ({cargando}) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    const { user, isAuthenticated, error: authError, logout } = useContext(UserContext);
    const { users, loading, error: usersError, deleteUser } = useUsers();


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
            <HeaderAdmin />
            <main className="main-content">
             
                    <h1 className="main-title">
                        <i className="fa-solid fa-users" style={{ marginRight: "0.5em" }}></i>
                        Usuarios
                    </h1>
                    {
                        cargando ?
                            (<img src={loading_img} alt="Cargando..." className="loading-img" />) :
                            <div className="users-list">


                             
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>Rol</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Array.isArray(users) && users.length > 0 ? (
                                                users.map((user) => (
                                                    <tr key={user.id || user.ID}>
                                                        <td>{user.name || user.Name}</td>
                                                        <td>{user.email || user.Email}</td>
                                                        <td>                                                            
                                                            {user.roles ? user.roles.map(role => {                                                            
                                                                return (
                                                                    <span key={role.ID} className="role-badge">
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
                                                                        setSelectedUser(user);
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
                                                        {loading ? 'Cargando usuarios...' : 'No hay usuarios disponibles'}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                                    Total de usuarios: {Array.isArray(users) ? users.length : 0}
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
                    }
              
            </main>

            <Footer />
        </>
    );
};

export default Users;

