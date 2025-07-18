import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Registrarse from './pages/Registrarse'
import AcercaDe from './pages/AcercaDe'
import GaleriaDeProductos from './pages/GaleriaDeProductos'
import DetallesProductos from './pages/DetallesProductos'
import Contactos from './pages/Contactos'
import NotFound from './pages/NotFound'
import IniciarSesion from './pages/IniciarSesion'
import Admin from './pages/Admin'
import Users from './pages/Users'
import AdminProductos from './pages/AdminProductos'
import AdminApis from './pages/AdminApis'
import AdminRoles from './pages/AdminRoles'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import RutasProtegidas from './auth/RutasProtegidas'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { UsersProvider } from './context/UsersContext'
import ResetPassword from './components/ResetPassword'
import AdminPedidos from './pages/AdminPedidos'
import AdminEstadisticas from './pages/AdminEstadisticas'
import ToastContainer from './components/ToastContainer'
import { ToastProvider, useToast } from './context/ToastContext'
import { RealTimeProvider } from './context/RealTimeContext'
import './index.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <RealTimeProvider>
            <ProductProvider>
              <CartProvider>
                <ToastProvider>
                  <AppRoutes />
                </ToastProvider>
              </CartProvider>
            </ProductProvider>
          </RealTimeProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  )
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const { toasts, removeToast } = useToast();



  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/acercade' element={<AcercaDe />} />
        <Route path='/productos' element={<GaleriaDeProductos />} />
        <Route path='/productos/:id' element={<DetallesProductos />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/contactos' element={<Contactos />} />
        <Route path='*' element={<NotFound />} />
        <Route path='/admin' element={
          <RutasProtegidas isAuthenticated={!!user} roles={['admin']}>
            <Admin />
          </RutasProtegidas>
        } />
        <Route path='/users' element={
          <RutasProtegidas isAuthenticated={!!user} roles={['admin']}>
            <UsersProvider>
              <Users />
            </UsersProvider>
          </RutasProtegidas>
        } />
        <Route path='/login' element={<IniciarSesion />} />
        <Route path='/registrarse' element={<Registrarse />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/admin/productos' element={
          <RutasProtegidas isAuthenticated={!!user} roles={['admin']}>
            <AdminProductos />
          </RutasProtegidas>
        } />
        <Route path='/admin/apis' element={
          <RutasProtegidas isAuthenticated={!!user} roles={['admin']}>
            <AdminApis />
          </RutasProtegidas>
        } />
        <Route path='/admin/roles' element={
          <RutasProtegidas isAuthenticated={!!user} roles={['admin']}>
            <AdminRoles />
          </RutasProtegidas>
        } />
        <Route path='/admin/pedidos' element={
          <RutasProtegidas isAuthenticated={!!user} roles={['admin']}>
            <AdminPedidos />
          </RutasProtegidas>
        } />
        <Route path='/admin/estadisticas' element={
          <RutasProtegidas isAuthenticated={!!user} roles={['admin']}>
            <AdminEstadisticas />
          </RutasProtegidas>
        } />
        <Route path='/mis-pedidos' element={
          <RutasProtegidas isAuthenticated={!!user}>
            <MyOrders />
          </RutasProtegidas>
        } />
      </Routes>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}

export default App
