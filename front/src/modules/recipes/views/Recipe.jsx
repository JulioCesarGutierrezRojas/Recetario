import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useLocation, useNavigate } from "react-router";
import { useState, useEffect } from 'react';
import CommentSection from "../../comments/views/comment";


const Recipe = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cardData } = location.state || {};

    const [averageRating, setAverageRating] = useState(4.2);
    const [reviews, setReviews] = useState([]); 

    // Función para calcular la calificación promedio
    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return totalRating / reviews.length;
    };

    useEffect(() => {
        // Calcula la calificación promedio cuando las reseñas cambian
        setAverageRating(calculateAverageRating(reviews));
    }, [reviews]);

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
        <div className="container-fluid align-items-center pt-4 mt-5">
            <div className="row d-flex position-relative">
                <div className="col-8">
                    <img src={cardData.image} className="img-fluid rounded shadow-sm w-100" alt={cardData.name}
                        style={{ height: "350px", objectFit: "cover" }} />
                </div>

                <div className="col-4 bg-white rounded shadow p-3 position-absolute"
                    style={{ right: "15px", width: "30%", maxHeight: "350px", overflowY: "auto" }}>
                    <CommentSection reviews={reviews} setReviews={setReviews} />
                </div>
            </div>

            <div className="mt-3 col-8">
                <h6 className='text-center fw-bold'>Calificación General: {averageRating.toFixed(1)} / 5 🍽️</h6>
                <div className="progress" role="progressbar" aria-valuenow={ratingPercentage} aria-valuemin="0" aria-valuemax="100"
                    style={{ height: "25px", borderRadius: "15px", boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)" }}>
                    <div className="progress-bar text-bg-warning"
                        style={{
                            width: `${ratingPercentage}%`, background: "linear-gradient(to right, #007bff, #00c6ff)",
                            borderRadius: "15px",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }} />
                </div>
            </div>

            <div className="container-fluid pb-4 ps-5 d-flex">
                <div className="row mt-4 h-auto">
                    <div className=" bg-body-secondary rounded shadow" style={{width:300}}>
                        <h5 className='fw-bold mt-2'>Ingredientes</h5>
                        <ul className="list-unstyled mt-3">
                            {cardData.recipe_ingredients && cardData.recipe_ingredients.map((item, index) => (
                                <li key={index} className="d-flex align-items-center mt-2">
                                    <input type="checkbox" id={`ingrediente-${index}`} className="form-check-input me-2"/>
                                    <label htmlFor={`ingrediente-${index}`} className="form-check-label">
                                        {item.ingredient || item.name || `Ingrediente ${index + 1}`} - {item.quantity}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="container-fluid ms-5 h-auto">
                    <div className="row mt-4">
                        <div className="rounded shadow">
                            <h5 className='fw-bold mt-2 text-center'>Procedimiento</h5>
                            <ul className="list-unstyled mt-3">
                                <li className="d-flex align-items-center mt-2">
                                    <label className="form-check-label text-justify">
                                        {cardData.process || "No hay procedimiento disponible."}
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

            <div className="d-flex justify-content-center mt-3 pb-4">
                <button className="btn btn-primary px-4 py-2 rounded shadow-sm" onClick={() => navigate("/home")}>
                    Regresar al inicio
                </button>
            </div>
        </div>
    );
};

export default Recipe;
