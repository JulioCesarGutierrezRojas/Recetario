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
        <div className="container-fluid align-items-start pt-4 mt-5">
            <div className="row d-flex flex-row">
                <div className="col-8">
                    <img src={cardData.image} className="img-fluid rounded shadow-sm w-100" alt={cardData.name}
                        style={{ height: "350px", objectFit: "cover" }} />

                    {/* Sección de Ingredientes y Procedimiento */}
                    <div className="container-fluid d-flex pt-4">
                        {/* Ingredientes */}
                        <div className="me-4 bg-body-secondary rounded shadow" style={{ width: "200px" }}>
                            <h5 className='fw-bold mt-2 p-2'>Ingredientes</h5>
                            <ul className="list-unstyled mt-3">
                                {cardData.recipe_ingredients && cardData.recipe_ingredients.map((item, index) => (
                                    <li key={index} className="mt-2" style={{ listStyleType: 'disc', marginLeft: '35px' }}>
                                        {item.ingredient || item.name || `Ingrediente ${index + 1}`} - {item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Procedimiento */}
                        <div className="flex-grow-1 bg-white rounded shadow p-2">
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

                {/* Comentarios */}
                <div className="col-4">
                    <div className="bg-white rounded shadow p-3 h-100" style={{ overflowY: "auto", maxHeight: "100%" }}>
                        <CommentSection reviews={reviews} setReviews={setReviews} recipeId={cardData.id} />
                    </div>
                </div>
            </div>

            {/* Botón regresar */}
            <div className="d-flex justify-content-center mt-3 pb-4">
                <button className="btn btn-primary px-4 py-2 rounded shadow-sm" onClick={() => navigate("/home")}>
                    Regresar al inicio
                </button>
            </div>
        </div>

    );
};

export default Recipe;
