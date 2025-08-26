import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/shop/Home'
import Registrarse from './pages/auth/Registrarse'
import AcercaDe from './pages/info/AcercaDe'
import GaleriaDeProductos from './pages/shop/GaleriaDeProductos'
import DetallesProductos from './pages/shop/DetallesProductos'
import Contactos from './pages/info/Contactos'
import NotFound from './pages/info/NotFound'
import IniciarSesion from './pages/auth/IniciarSesion'
const Admin = lazy(() => import('./pages/admin/Admin'))
const Users = lazy(() => import('./pages/admin/Users'))
const AdminProductos = lazy(() => import('./pages/admin/AdminProductos'))
const AdminApis = lazy(() => import('./pages/admin/AdminApis'))
const AdminRoles = lazy(() => import('./pages/admin/AdminRoles'))
import Checkout from './pages/shop/Checkout'
import MyOrders from './pages/shop/MyOrders'
import RutasProtegidas from './auth/RutasProtegidas'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { UsersProvider } from './context/UsersContext'
import ResetPassword from './components/ResetPassword'
const AdminPedidos = lazy(() => import('./pages/admin/AdminPedidos'))
const AdminEstadisticas = lazy(() => import('./pages/admin/AdminEstadisticas'))
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
                  <Suspense fallback={<div style={{padding:16}}>Cargando…</div>}>
                    <AppRoutes />
                  </Suspense>
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
