import { useContext } from 'react'
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
import RutasProtegidas from './auth/RutasProtegidas'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { UsersProvider } from './context/UsersContext'
import ResetPassword from './components/ResetPassword'
import AdminPedidos from './pages/AdminPedidos'
import './index.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <ProductProvider>
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          </ProductProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  )
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#1A5632'
      }}>
        Cargando...
      </div>
    );
  }

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
      </Routes>
    </>
  )
}

export default App
