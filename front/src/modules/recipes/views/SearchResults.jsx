import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate, useLocation } from "react-router";
import { useEffect, useState } from 'react';
import { searchRecipes, getAllRatings, calculateAverageRating } from '../controller/controllerHome';
import { FaUtensilSpoon } from "react-icons/fa";

const SearchResults = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');

    const handleCardClick = (card) => {
        navigate('/recipe', { state: { cardData: card } });
    };

    const handleBackHome = () => {
        navigate('/home');
    };

    useEffect(() => {
        // Get the search query from location state
        const searchQuery = location.state?.searchQuery || '';
        setQuery(searchQuery);

        const fetchData = async () => {
            setLoading(true);
            try {
                const [recipes, ratings] = await Promise.all([
                    searchRecipes(searchQuery),
                    getAllRatings()
                ]);

                const recipesWithRatings = recipes.map(recipe => {
                    // Calculate average rating using the helper function
                    const averageRating = calculateAverageRating(ratings, recipe.id);

                    return {
                        ...recipe,
                        calification: averageRating
                    };
                });

                setCards(recipesWithRatings);
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.state]);

    return (
        <div className="container pt-5 mt-4" style={{ paddingTop: '120px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>{query ? `Resultados de búsqueda: ${query}` : 'Todas las recetas'}</h1>
                <button className="btn btn-secondary" onClick={handleBackHome}>Regresar al Menú</button>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : cards.length === 0 ? (
                <div className="alert alert-info">
                    No se encontraron recetas que coincidan con "{query}". Intenta con otra búsqueda.
                </div>
            ) : (
                <div className="row">
                    {cards.map((card, index) => (
                        <div key={index} className="col-md-3 mb-4">
                            <div
                                className="card shadow-sm"
                                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                                onClick={() => handleCardClick(card)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
                            >
                                <img src={card.image} className="card-img-top" alt={card.name} style={{ height: "200px", objectFit: "cover" }} />
                                <div className="card-body text-center">
                                    <p className="card-title fw-bold">{card.name}</p>

                                    <p className="mb-1">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <FaUtensilSpoon
                                                key={i}
                                                size={20}
                                                color={i < Math.round(card.calification) ? "#FFCC00" : "#e4e5e9"}
                                                style={{ marginRight: "2px" }}
                                            />
                                        ))}
                                    </p>
                                    <small className="text-muted fw-bold">Calificación: {card.calification.toFixed(1)} / 5</small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
