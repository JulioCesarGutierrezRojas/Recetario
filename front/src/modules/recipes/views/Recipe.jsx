import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from 'react';
import NavBar from '../../../components/NavBar';

const Recipe = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cardData } = location.state || {}; 
    const [averageRating, setAverageRating] = useState(4.2); 
    const ratingPercentage = (averageRating / 5) * 100;

    if (!cardData) {
        return (
            <div className="container text-center mt-5">
                <h1>No se encontró la receta</h1>
                <button className="btn btn-primary mt-3" onClick={() => navigate("/home")}>Volver al inicio</button>
            </div>
        );
    }

    return (
        <>
        
        <div className="container-fluid align-items-center pt-4">
            <div className="row d-flex position-relative ">
                <div className="col-8">
                    <img src={cardData.img} className="img-fluid rounded shadow-sm w-100" alt={cardData.title} 
                        style={{ height: "350px", objectFit: "cover" }}/>
                </div>

                <div className="col-4 bg-white rounded shadow p-3 position-absolute "
                    style={{ right: "15px", width: "30%", maxHeight: "350px", overflowY: "auto" }}>
                    <h5 className='text-center fw-bold'>Comentarios</h5>
                    <p>Aquí van los comentarios...</p>
                    <p>Aquí van los comentarios...</p>
                    <p>Aquí van los comentarios...</p>
                    <p>Aquí van los comentarios...</p>
                    <p>Aquí van los comentarios...</p>
                    <p>Aquí van los comentarios...</p>
                    <p>Aquí van los comentarios...</p>
                    <p>Aquí van los comentarios...</p>
                </div>
            </div>
            
            <div className="mt-3 col-8">
                <h6 className='text-center fw-bold'>Calificación General: {averageRating} / 5 🍽️</h6>
                <div className="progress" role="progressbar" aria-valuenow={ratingPercentage} aria-valuemin="0" aria-valuemax="100"
                    style={{ height: "25px", borderRadius: "15px", boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)" }}>
                    <div className="progress-bar text-bg-warning"
                        style={{ width: `${ratingPercentage}%`, background: "linear-gradient(to right, #ffaf00, #ff5400)", 
                            borderRadius: "15px",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"}}>
                    </div>
                </div>
            </div>

            

        </div>

        </>
    );
};

export default Recipe;
