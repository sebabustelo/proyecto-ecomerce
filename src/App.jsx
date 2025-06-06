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
import RutasProtegidas from './auth/RutasProtegidas'
import { CartContext } from './context/CartContext'
import { UserProvider } from './context/UserContext'
import { UsersProvider } from './context/UsersContext'
import './index.css'

function App() {
  const {
    cart,
    productos,
    cargando,   
    mensaje,
    isAuthenticated,
    setIsAuthenticated,
  } = useContext(CartContext);

  return (
    <Router>
      <UserProvider>
          <Routes>
            <Route path='/' element={<Home cart={cart} />} />
            <Route path='/acercade' element={<AcercaDe cart={cart} />} />
            <Route path='/productos' element={
              <GaleriaDeProductos
                cart={cart}
                productos={productos}           
                cargando={cargando}
              />
            } />
            <Route path='/productos/:id' element={
              <DetallesProductos
                cart={cart}            
                productos={productos}
                cargando={cargando} />
            } />
            <Route path='/contactos' element={<Contactos cart={cart} />} />
            <Route path='*' element={<NotFound />} />
            <Route path='/admin' element={<RutasProtegidas isAuthenticated={isAuthenticated}> <Admin /></RutasProtegidas>} />
            <Route
              path='/users'
              element={
                <RutasProtegidas isAuthenticated={isAuthenticated}>
                  <UsersProvider>
                    <Users cargando={cargando} />
                  </UsersProvider>
                </RutasProtegidas>
              }
            />
            <Route path='/login' element={<IniciarSesion setIsAuthenticated={setIsAuthenticated} />} />
            <Route path='/registrarse' element={<Registrarse />} />
            <Route
              path='/admin/productos'
              element={
                <RutasProtegidas isAuthenticated={isAuthenticated}>
                  <AdminProductos  cargando={cargando} />
                </RutasProtegidas>
              }
            />
          </Routes>
          {mensaje && (
            <div className="mensaje-overlay">
              <div className="mensaje-box">
                {mensaje}
              </div>
            </div>
          )}
      </UserProvider>
    </Router>
  )
}

export default App
