import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import HeaderAdmin from '../components/estaticos/HeaderAdmin';
import Footer from '../components/estaticos/Footer';
import loading_img from '../assets/loading.gif'
import './Users.css';

const AdminRoles = () => {
    const [roles, setRoles] = useState([]);
    const [apis, setApis] = useState([]);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [roleData, setRoleData] = useState({
        name: '',
        description: '',
        apis: []
    });
    const [showApisModal, setShowApisModal] = useState(false);
    const [apisModalList, setApisModalList] = useState([]);
    const [apisModalRoleName, setApisModalRoleName] = useState("");
    const [openGroups, setOpenGroups] = useState({});

    // Función para verificar el token
    const checkToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/check`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Error verificando token:', error);
            return false;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Verificar si el usuario está logueado
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No hay token de autenticación. Por favor, inicie sesión.');
                    setLoading(false);
                    return;
                }

                // Obtener roles
                const rolesResponse = await fetch(`${API_BASE_URL}/roles`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (!rolesResponse.ok) {
                    throw new Error(`Error ${rolesResponse.status}: ${rolesResponse.statusText}`);
                }
                const rolesData = await rolesResponse.json();
                const normalizedRoles = rolesData.map(role => ({
                    id: role.ID,
                    name: role.name,
                    description: role.description,
                    apis: (role.Apis || []).map(api => ({
                        id: api.ID || api.id,
                        endpoint: api.endpoint,
                        description: api.description
                    })),
                    users: (role.Users || []).map(user => ({
                        id: user.ID,
                        name: user.name,
                        email: user.email
                    }))
                }));
                setRoles(normalizedRoles);
                setFilteredRoles(normalizedRoles);

                // Obtener APIs
                const apisResponse = await fetch(`${API_BASE_URL}/apis`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!apisResponse.ok) {
                    throw new Error(`Error ${apisResponse.status}: ${apisResponse.statusText}`);
                }
                const apisData = await apisResponse.json();
                setApis(apisData.map(api => ({
                    id: api.ID || api.id,
                    endpoint: api.endpoint,
                    description: api.description
                })));

            } catch (err) {
                console.error('Error al obtener datos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Función para filtrar roles
    useEffect(() => {
        const filtered = roles.filter(role => {
            const searchTermLower = searchTerm.toLowerCase();
            return (
                (role.name || '').toLowerCase().includes(searchTermLower) ||
                (role.description || '').toLowerCase().includes(searchTermLower)
            );
        });
        setFilteredRoles(filtered);
    }, [searchTerm, roles]);

    // Función para truncar texto
    const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const handleDelete = async (roleId) => {
        // Verificar token antes de proceder
        const tokenValid = await checkToken();
        if (!tokenValid) {
            alert('Token de autenticación inválido o expirado. Por favor, inicie sesión nuevamente.');
            return;
        }

        if (window.confirm('¿Estás seguro de que deseas eliminar este rol?')) {
            try {
                setLoading(true);

                const token = localStorage.getItem('token');
                console.log('Token para eliminar:', token ? 'Presente' : 'No encontrado');
                const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                // Eliminar el rol de la lista local
                setRoles(prevRoles =>
                    prevRoles.filter(role => role.id !== roleId)
                );

                alert('Rol eliminado correctamente');

            } catch (error) {
                console.error('Error al eliminar rol:', error);
                alert(`Error al eliminar rol: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar token antes de proceder
        const tokenValid = await checkToken();
        if (!tokenValid) {
            alert('Token de autenticación inválido o expirado. Por favor, inicie sesión nuevamente.');
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem('token');
            const roleDataToSend = {
                name: roleData.name,
                description: roleData.description,
                apis: roleData.apis
            };

            let response;
            let result;

            if (isEditing && selectedRole) {
                // Editar rol existente
                const url = `${API_BASE_URL}/roles/${selectedRole.id}`;
                const urlApis = `${API_BASE_URL}/roles/${selectedRole.id}/apis`;
                console.log('Editando rol en URL:', url);
                console.log(roleDataToSend);
                console.log('Token:', token ? 'Presente' : 'No encontrado');

                // Actualizar APIs asociadas
                const responseApis = await fetch(urlApis, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ apis: roleData.apis })
                });

                if (!responseApis.ok) {
                    throw new Error(`Error ${responseApis.status}: ${responseApis.statusText}`);
                }

                // Refresca la lista de roles desde el backend
                const rolesResponse = await fetch(`${API_BASE_URL}/roles`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (rolesResponse.ok) {
                    const rolesData = await rolesResponse.json();
                    const normalizedRoles = rolesData.map(role => ({
                        id: role.ID,
                        name: role.name,
                        description: role.description,
                        apis: (role.Apis || []).map(api => ({
                            id: api.ID || api.id,
                            endpoint: api.endpoint,
                            description: api.description
                        })),
                        users: (role.Users || []).map(user => ({
                            id: user.ID,
                            name: user.name,
                            email: user.email
                        }))
                    }));
                    setRoles(normalizedRoles);
                    setFilteredRoles(normalizedRoles);
                }

                alert('APIs del rol actualizadas correctamente');
                setShowModal(false);
                setSelectedRole(null);
                setRoleData({ name: '', description: '', apis: [] });
                setIsEditing(false);
            } else {
                // Crear nuevo rol
                const url = `${API_BASE_URL}/roles`;
                console.log('Creando rol en URL:', url);
                console.log('Datos a enviar:', roleDataToSend);
                console.log('Token:', token ? 'Presente' : 'No encontrado');

                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(roleDataToSend)
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                result = await response.json();

                // Agregar el nuevo rol a la lista
                setRoles(prevRoles => [...prevRoles, result]);

                alert('Rol creado correctamente');
            }

            setShowModal(false);
            setSelectedRole(null);
            setRoleData({
                name: '',
                description: '',
                apis: []
            });
            setIsEditing(false);

        } catch (error) {
            console.error('Error al procesar rol:', error);
            alert(`Error al procesar rol: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleApiToggle = (apiId) => {
        setRoleData(prev => ({
            ...prev,
            apis: prev.apis.includes(apiId)
                ? prev.apis.filter(id => id !== apiId)
                : [...prev.apis, apiId]
        }));
    };

    // Agrupa las APIs por categoría
    function groupApisByCategory(apis) {
        const groups = {};
        apis.forEach(api => {
            const match = api.endpoint.match(/^\/([^\/]+)/);
            const category = match ? match[1] : 'otros';
            if (!groups[category]) groups[category] = [];
            groups[category].push(api);
        });
        return groups;
    }

    return (
        <>
            <div className="admin-page">
            <HeaderAdmin />
            <main className="main-content">
                <div className="header-container">
                    <h1 className="main-title">
                        <i className="fa-solid fa-user-tag" style={{ marginRight: "0.5em" }}></i>
                        Roles y Permisos
                    </h1>
                    <button
                        className="add-button"
                        onClick={() => {
                            setSelectedRole(null);
                            setRoleData({
                                name: '',
                                description: '',
                                apis: []
                            });
                            setIsEditing(false);
                            setShowModal(true);
                        }}
                    >
                        <i className="fa-solid fa-plus"></i>
                        Nuevo Rol
                    </button>
                </div>

                {/* Barra de búsqueda */}
                <div className="search-container">
                    <div className="search-box">
                        <i className="fa-solid fa-search search-icon"></i>
                        <input
                            type="text"
                            placeholder="Buscar roles..."
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
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>APIs Asignadas</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(filteredRoles) && filteredRoles.length > 0 ? (
                                    filteredRoles.map((role, idx) => (
                                        <tr key={role.id || idx}>
                                            <td>{role.name}</td>
                                            <td className="description-cell" title={role.description}>
                                                {truncateText(role.description)}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                                    {role.apis.slice(0, 2).map((api, index) => (
                                                        <span key={api.id || index} className="role-badge" style={{ backgroundColor: '#4caf50' }}>
                                                            {api.endpoint}
                                                        </span>
                                                    ))}
                                                    {role.apis.length > 2 && (
                                                        <button
                                                            style={{ marginLeft: '0.5em', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                                                            onClick={() => {
                                                                setApisModalList(role.apis);
                                                                setApisModalRoleName(role.name);
                                                                setShowApisModal(true);
                                                            }}
                                                        >
                                                            Ver todas
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="action-button edit-button icon-button"
                                                        onClick={() => {
                                                            setSelectedRole(role);
                                                            setRoleData({
                                                                name: role.name || '',
                                                                description: role.description || '',
                                                                apis: role.apis ? role.apis.map(api => api.id) : []
                                                            });
                                                            setIsEditing(true);
                                                            setShowModal(true);
                                                        }}
                                                    >
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </button>
                                                    <button
                                                        className="action-button delete-button icon-button"
                                                        onClick={() => handleDelete(role.id)}
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
                                            {searchTerm ? 'No se encontraron roles' : 'No hay roles disponibles'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                        Total de roles: {filteredRoles.length}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>

                        {showModal && (
                            <div className="modal">
                                <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
                                    <h2>{isEditing ? 'Editar Rol' : 'Nuevo Rol'}</h2>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="name">Nombre *</label>
                                            <input
                                                type="text"
                                                id="name"
                                                className="form-control"
                                                value={roleData.name}
                                                onChange={(e) => setRoleData({ ...roleData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="description">Descripción</label>
                                            <textarea
                                                id="description"
                                                className="form-control"
                                                value={roleData.description}
                                                onChange={(e) => setRoleData({ ...roleData, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>APIs Asignadas</label>
                                            <div style={{
                                                maxHeight: '250px',
                                                overflowY: 'auto',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                padding: '0.5rem',
                                                background: '#f9f9f9',
                                            }}>
                                                {Object.entries(groupApisByCategory(apis)).map(([category, apisInGroup]) => (
                                                    <div key={category} style={{ marginBottom: '1em', border: '1px solid #eee', borderRadius: 6 }}>
                                                        <div
                                                            style={{
                                                                background: '#f0f4f8',
                                                                padding: '0.5em 1em',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                                borderRadius: '6px 6px 0 0',
                                                                userSelect: 'none'
                                                            }}
                                                            onClick={() => setOpenGroups(prev => ({ ...prev, [category]: !prev[category] }))}
                                                        >
                                                            {category.charAt(0).toUpperCase() + category.slice(1)} ({apisInGroup.length})
                                                            <span style={{ float: 'right' }}>{openGroups[category] ? '▲' : '▼'}</span>
                                                        </div>
                                                        {openGroups[category] && (
                                                            <div style={{ padding: '0.5em 1em', background: '#fff' }}>
                                                                {apisInGroup.map(api => {
                                                                    const selected = roleData.apis.includes(api.ID || api.id);
                                                                    return (
                                                                        <label
                                                                            key={api.ID || api.id}
                                                                            style={{
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                gap: '0.5rem',
                                                                                marginBottom: '0.25rem',
                                                                                padding: '0.25rem 0.5rem',
                                                                                borderRadius: 16,
                                                                                background: selected ? '#e3f2fd' : '#fff',
                                                                                border: selected ? '1.5px solid #2196f3' : '1px solid #ddd',
                                                                                boxShadow: selected ? '0 2px 8px rgba(33,150,243,0.08)' : 'none',
                                                                                cursor: 'pointer',
                                                                                transition: 'background 0.2s, border 0.2s'
                                                                            }}
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={selected}
                                                                                onChange={() => handleApiToggle(api.ID || api.id)}
                                                                                style={{ accentColor: '#2196f3' }}
                                                                            />
                                                                            <span style={{ fontSize: '0.95rem', fontWeight: selected ? 600 : 400, color: selected ? '#1976d2' : '#333' }}>
                                                                                {api.endpoint}
                                                                                {api.description && (
                                                                                    <span style={{ color: '#666', marginLeft: '0.5rem', fontWeight: 400, fontSize: '0.9em' }}>
                                                                                        - {api.description}
                                                                                    </span>
                                                                                )}
                                                                            </span>
                                                                        </label>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
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
            {/* Modal para mostrar todas las APIs asociadas al rol */}
            {showApisModal && (
                <div className="modal" style={{ zIndex: 9999 }}>
                    <div className="modal-content" style={{ maxWidth: '400px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <h2>APIs de rol: {apisModalRoleName}</h2>
                        <ul style={{ paddingLeft: '1.2em' }}>
                            {apisModalList.map((api) => (
                                <li key={api.id}>{api.endpoint} <span style={{ color: '#888', fontSize: '0.9em' }}>{api.description}</span></li>
                            ))}
                        </ul>
                        <div style={{ textAlign: 'right', marginTop: '1em' }}>
                            <button className="cancel-button" onClick={() => setShowApisModal(false)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div >
        </>
    );
};

export default AdminRoles; 