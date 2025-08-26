import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import HeaderAdmin from '../../components/estaticos/HeaderAdmin';
import Footer from '../../components/estaticos/Footer';
import { API_BASE_URL } from '../../utils/apiConfig';
import './AdminEstadisticas.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Función para traducir estados al español
const translateStatus = (status) => {
  const statusTranslations = {
    'pending': 'Pendiente',
    'processing': 'En Proceso',
    'completed': 'Completado',
    'cancelled': 'Cancelado',
    'shipped': 'Enviado',
    'delivered': 'Entregado',
    'returned': 'Devuelto',
    'confirmed': 'Confirmado' 
  };
  return statusTranslations[status] || status;
};

// Tooltip personalizado para PieChart
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { status, count } = payload[0].payload;
    return (
      <div style={{ background: '#fff', color: '#222', border: '1px solid #ccc', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <strong>{status}</strong>: Cantidad: {count} pedidos
      </div>
    );
  }
  return null;
};

// Tooltip personalizado para BarChart
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { status, count } = payload[0].payload;
    return (
      <div style={{ background: '#fff', color: '#222', border: '1px solid #ccc', padding: '8px', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <strong>{status}</strong>: Cantidad: {count} pedidos
      </div>
    );
  }
  return null;
};

const AdminEstadisticas = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Últimos 10 días
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchOrders();
  }, [dateRange]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar los pedidos');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Procesar datos para gráficos
  const processChartData = () => {
    if (!orders.length) {
      return { dailyData: [], statusData: [], totalStats: {} };
    }

    // Filtrar por rango de fechas
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return orderDate >= startDate && orderDate <= endDate;
    });

    // Datos por día
    const dailyData = filteredOrders.reduce((acc, order) => {
      const date = new Date(order.created_at).toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit',
        year: '2-digit'
      });
      
      if (!acc[date]) {
        acc[date] = { date, orders: 0, total: 0 };
      }
      
      acc[date].orders += 1;
      acc[date].total += parseFloat(order.total_amount || 0);
      
      return acc;
    }, {});

    // Datos por estado (traducidos al español)
    const statusData = filteredOrders.reduce((acc, order) => {
      const status = order.status || 'pending';
      const translatedStatus = translateStatus(status);
      if (!acc[translatedStatus]) {
        acc[translatedStatus] = { status: translatedStatus, count: 0 };
      }
      acc[translatedStatus].count += 1;
      return acc;
    }, {});

    // Estadísticas totales
    const totalStats = {
      totalOrders: filteredOrders.length,
      totalRevenue: filteredOrders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0),
      averageOrderValue: filteredOrders.length > 0 
        ? filteredOrders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) / filteredOrders.length 
        : 0
    };

    return {
      dailyData: Object.values(dailyData),
      statusData: Object.values(statusData),
      totalStats
    };
  };

  const { dailyData, statusData, totalStats } = processChartData();

  if (loading) {
    return (
      <div className="admin-page">
        <HeaderAdmin />
        <main className="main-content">
          <div className="stats-loading">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>Cargando estadísticas...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <HeaderAdmin />
        <main className="main-content">
          <div className="stats-error">
            <i className="fa-solid fa-exclamation-triangle"></i>
            <p>Error: {error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <Helmet>
        <title>Estadísticas | Admin | E-commerce</title>
        <meta name="description" content="Estadísticas y reportes de pedidos, ventas y rendimiento del sistema e-commerce." />
      </Helmet>
      <HeaderAdmin />
      <main className="main-content">
        <div className="header-container">
          <h1 className="main-title">
            <i className="fa-solid fa-chart-line" style={{ marginRight: "0.5em" }}></i>
            Estadísticas del Sistema
          </h1>
          <div className="header-buttons">
            <Link to="/admin" className="back-button">
              <i className="fa-solid fa-arrow-left"></i>
              Volver al Admin
            </Link>
          </div>
        </div>

        {/* Filtros de fecha */}
        <div className="stats-filters">
          <div className="date-range">
            <label htmlFor="startDate">Fecha inicial:</label>
            <input
              type="date"
              id="startDate"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="date-range">
            <label htmlFor="endDate">Fecha final:</label>
            <input
              type="date"
              id="endDate"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="stats-summary">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fa-solid fa-shopping-cart"></i>
            </div>
            <div className="stat-content">
              <h3>Total Pedidos</h3>
              <p className="stat-number">{totalStats.totalOrders}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fa-solid fa-dollar-sign"></i>
            </div>
            <div className="stat-content">
              <h3>Ingresos Totales</h3>
              <p className="stat-number">${totalStats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fa-solid fa-chart-bar"></i>
            </div>
            <div className="stat-content">
              <h3>Valor Promedio</h3>
              <p className="stat-number">${totalStats.averageOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="charts-container">
          {/* Gráfico de líneas - Pedidos por día */}
          <div className="chart-section">
            <h2>Pedidos por Día</h2>
            {dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="orders" stroke="#8884d8" name="Pedidos" />
                  <Line type="monotone" dataKey="total" stroke="#82ca9d" name="Ingresos ($)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: '#666' }}>
                <p>No hay datos para mostrar en el rango de fechas seleccionado</p>
              </div>
            )}
          </div>

          {/* Gráfico de barras - Estado de pedidos */}
          <div className="chart-section">
            <h2>Estado de Pedidos</h2>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis label={{ value: 'Cantidad', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend formatter={() => 'Cantidad'} />
                  <Bar dataKey="count" fill="#8884d8" name="Cantidad" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: '#666' }}>
                <p>No hay datos para mostrar en el rango de fechas seleccionado</p>
              </div>
            )}
          </div>

          {/* Gráfico circular - Distribución por estado */}
          <div className="chart-section">
            <h2>Distribución por Estado</h2>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, count }) => `${status}: Cantidad: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: '#666' }}>
                <p>No hay datos para mostrar en el rango de fechas seleccionado</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabla de datos */}
        <div className="stats-table-section">
          <h2>Detalle de Pedidos</h2>
          <div className="table-container">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{new Date(order.created_at).toLocaleDateString('es-ES')}</td>
                    <td>{order.recipient_name || 'N/A'}</td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {translateStatus(order.status)}
                      </span>
                    </td>
                    <td>${parseFloat(order.total_amount || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminEstadisticas; 