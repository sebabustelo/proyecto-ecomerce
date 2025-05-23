import Header from '../components/estaticos/Header'
import Footer from '../components/estaticos/Footer'
import ProductList from '../components/ProductosList'
import loading from '../assets/loading.gif'


const GaleriaDeProductos = ({

  cargando,
}) => {


  return (
    <>
      <Header />
      <main className="main-content">
        <div className="hero-section">
          <h1 className="main-title">
            <i className="fa-solid fa-store" style={{ marginRight: "0.5em" }}></i>
            Galería de Productos
          </h1>
          {
            cargando ?
              (<img src={loading} alt="Cargando..." className="loading-img" />) :
              <ProductList detalleProducto={1} />
          }
        </div>
      </main>
      <Footer />
    </>
  )
}

export default GaleriaDeProductos