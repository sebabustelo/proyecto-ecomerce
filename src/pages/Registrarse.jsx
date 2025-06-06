import Register from '../components/Register'
import Header from "../components/estaticos/Header";
import Footer from "../components/estaticos/Footer";

const Registrarse = () => {
    return (
        <>
            <Header />
            <div className="main-content">
                <div className="hero-section">
                    <Register />
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Registrarse;

