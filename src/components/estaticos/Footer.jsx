import React from 'react'
import './styleEstatico.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    return (
        <footer >
            <div >
                <div className="footer-section" style={{ display: "flex", gap: "18px", alignItems: "center", justifyContent: "center" }}>
                    <a href="#" aria-label="Facebook">
                        <FontAwesomeIcon icon={faFacebook} style={{ color: "#FFB74D", fontSize: "1.5rem" }} />
                    </a>
                    <a href="#" aria-label="Twitter">
                        <FontAwesomeIcon icon={faTwitter} style={{ color: "#FFB74D", fontSize: "1.5rem" }} />
                    </a>
                    <a href="#" aria-label="Instagram">
                        <FontAwesomeIcon icon={faInstagram} style={{ color: "#FFB74D", fontSize: "1.5rem" }} />
                    </a>
                </div>
                <div className="footer-section" style={{ display: "flex", gap: "1.5rem", alignItems: "center", justifyContent: "center", flexWrap: "wrap", fontSize: "1rem" }}>
                    <span>Email: info@tienda.com</span>
                    <span>Tel: (11) 4561-7890</span>
                    <span>Dirección: Juan Agustín Garcia 1855</span>
                    <span> &copy; 2025 Tienda Online.</span>
                </div>
                
            </div>
        </footer>
    );
}

export default Footer;