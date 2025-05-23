import { useContext } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AcercaDe from './pages/AcercaDe'
import GaleriaDeProductos from './pages/GaleriaDeProductos'
import DetallesProductos from './pages/DetallesProductos'
import Contactos from './pages/Contactos'
import NotFound from './pages/NotFound'
import IniciarSesion from './pages/IniciarSesion'
import Admin from './pages/Admin'
import RutasProtegidas from './auth/RutasProtegidas'
import { CartContext } from './context/CartContext'
import './index.css'


function App() {

  const {
    cart,
    productos,
    cargando,   
    mensaje,
    isAuthenticated,
    setIsAuthenticated,
    //  error,
    // handleAddToCart,
    // handleDeleteItem,
    // handleDeleteCart
  } = useContext(CartContext);


  return (
    <Router>
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
        <Route path='/login' element={<IniciarSesion setIsAuthenticated={setIsAuthenticated} />} />

      </Routes>
      {mensaje && (
        <div className="mensaje-overlay">
          <div className="mensaje-box">
            {mensaje}
          </div>
        </div>
      )}
    </Router >
  )
}

export default App
