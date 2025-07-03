import { useContext } from 'react'
import Header from '../components/estaticos/Header'
import Footer from '../components/estaticos/Footer'
import ProductList from '../components/ProductosList'
import SearchAndFilters from '../components/SearchAndFilters'
import { ProductContext } from '../context/ProductContext'
import loading from '../assets/loading.gif'

const GaleriaDeProductos = () => {
  const { cargando, productosFiltrados } = useContext(ProductContext);

  return (
    <>
      <Header />
      <main className="main-content">
        <div className="hero-section">
          <h1 className="main-title">
            <i className="fa-solid fa-store" style={{ marginRight: "0.5em" }}></i>
            Galería de Productos
          </h1>
          
          {!cargando && <SearchAndFilters />}
          
          {cargando ? (
            <div >
              <img src={loading} alt="Cargando..." className="loading-img" />
              <p className="loading-text">Cargando productos...</p>
            </div>
          ) : (
            <>
              {productosFiltrados.length === 0 ? (
                <div className="no-results">
                  <i className="fa-solid fa-search" style={{ fontSize: "3rem", color: "#ccc", marginBottom: "1rem" }}></i>
                  <h3>No se encontraron productos</h3>
                  <p>Intenta con otros términos de búsqueda o filtros</p>
                </div>
              ) : (
                <ProductList productos={productosFiltrados} detalleProducto={1} />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default GaleriaDeProductos