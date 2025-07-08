import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/apiConfig";

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filtro, setFiltro] = useState("");

  // Reemplaza esto por cómo guardas el token en tu app
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener pedidos");
        return res.json();
      })
      .then((data) => {
        setPedidos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  const abrirModal = (pedido, editar = false) => {
    setPedidoSeleccionado(pedido);
    setEditMode(editar);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setPedidoSeleccionado(null);
    setEditMode(false);
  };

  const cambiarEstadoPedido = (pedido, nuevoEstado) => {
    fetch(`${API_BASE_URL}/orders/${pedido.ID || pedido.id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: nuevoEstado }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al actualizar estado");
        setPedidos((pedidos) =>
          pedidos.map((p) =>
            (p.ID || p.id) === (pedido.ID || pedido.id)
              ? { ...p, Status: nuevoEstado }
              : p
          )
        );
      })
      .catch((err) => alert(err.message));
  };

  // Ejemplo de edición: solo permite cambiar el estado desde el modal
  const handleEditarPedido = (nuevoEstado) => {
    if (!pedidoSeleccionado) return;
    cambiarEstadoPedido(pedidoSeleccionado, nuevoEstado);
    cerrarModal();
  };

  const eliminarPedido = (pedido) => {
    if (!window.confirm("¿Seguro que deseas eliminar este pedido?")) return;
    fetch(`${API_BASE_URL}/orders/${pedido.ID || pedido.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar pedido");
        setPedidos((pedidos) =>
          pedidos.filter((p) => (p.ID || p.id) !== (pedido.ID || pedido.id))
        );
        cerrarModal();
      })
      .catch((err) => alert(err.message));
  };

  const pedidosFiltrados = pedidos.filter(pedido => {
    const usuario = pedido.User
      ? (pedido.User.nombre || pedido.User.username || pedido.User.email)
      : "";
    const estado = pedido.Status || pedido.status || "";
    const id = (pedido.ID || pedido.id || "").toString();
    return (
      usuario.toLowerCase().includes(filtro.toLowerCase()) ||
      estado.toLowerCase().includes(filtro.toLowerCase()) ||
      id.includes(filtro)
    );
  });

  if (loading) return <div>Cargando pedidos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-pedidos-page">
      <h1>Gestión de Pedidos</h1>
      <input
        type="text"
        placeholder="Buscar por usuario, estado o ID"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
        style={{marginBottom: '1rem', padding: '0.5rem', width: '300px'}}
      />
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidosFiltrados.map((pedido) => (
            <tr key={pedido.ID || pedido.id}>
              <td>{pedido.ID || pedido.id}</td>
              <td>
                {pedido.User
                  ? pedido.User.nombre || pedido.User.username || pedido.User.email
                  : "Sin usuario"}
              </td>
              <td>${pedido.TotalAmount?.toFixed(2) || pedido.total_amount}</td>
              <td>
                <select
                  value={pedido.Status || pedido.status}
                  onChange={e => cambiarEstadoPedido(pedido, e.target.value)}
                >
                  <option value="pendiente">pendiente</option>
                  <option value="enviado">enviado</option>
                  <option value="entregado">entregado</option>
                  <option value="cancelado">cancelado</option>
                </select>
              </td>
              <td>
                {pedido.CreatedAt
                  ? new Date(pedido.CreatedAt).toLocaleDateString()
                  : pedido.created_at
                  ? new Date(pedido.created_at).toLocaleDateString()
                  : ""}
              </td>
              <td>
                <button onClick={() => abrirModal(pedido, false)}>Ver</button>
                <button onClick={() => abrirModal(pedido, true)}>Editar</button>
                <button onClick={() => eliminarPedido(pedido)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de detalles/edición */}
      {modalAbierto && pedidoSeleccionado && (
        <div className="modal" style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
          <div className="modal-content" style={{background:'#fff',padding:'2rem',borderRadius:'8px',minWidth:'300px',maxWidth:'90vw',maxHeight:'90vh',overflowY:'auto'}}>
            <h2>Detalles del Pedido #{pedidoSeleccionado.ID || pedidoSeleccionado.id}</h2>
            <p><b>Usuario:</b> {pedidoSeleccionado.User ? pedidoSeleccionado.User.nombre || pedidoSeleccionado.User.username || pedidoSeleccionado.User.email : "Sin usuario"}</p>
            <p><b>Total:</b> ${pedidoSeleccionado.TotalAmount?.toFixed(2) || pedidoSeleccionado.total_amount}</p>
            <p><b>Estado:</b> {pedidoSeleccionado.Status || pedidoSeleccionado.status}</p>
            <p><b>Fecha:</b> {pedidoSeleccionado.CreatedAt ? new Date(pedidoSeleccionado.CreatedAt).toLocaleDateString() : pedidoSeleccionado.created_at ? new Date(pedidoSeleccionado.created_at).toLocaleDateString() : ""}</p>
            <h3>Items:</h3>
            <ul>
              {(pedidoSeleccionado.Items || pedidoSeleccionado.items || []).map(item => (
                <li key={item.ID || item.id}>
                  {item.Product ? item.Product.nombre || item.Product.name : "Producto"} - Cantidad: {item.Quantity || item.quantity} - Precio: ${item.UnitPrice || item.unit_price}
                </li>
              ))}
            </ul>
            {editMode ? (
              <div style={{marginTop:'1rem'}}>
                <label>
                  Cambiar estado:
                  <select
                    defaultValue={pedidoSeleccionado.Status || pedidoSeleccionado.status}
                    onChange={e => handleEditarPedido(e.target.value)}
                  >
                    <option value="pendiente">pendiente</option>
                    <option value="enviado">enviado</option>
                    <option value="entregado">entregado</option>
                    <option value="cancelado">cancelado</option>
                  </select>
                </label>
                <button style={{marginLeft:'1rem'}} onClick={cerrarModal}>Cancelar</button>
              </div>
            ) : (
              <button style={{marginTop:'1rem'}} onClick={cerrarModal}>Cerrar</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPedidos;
