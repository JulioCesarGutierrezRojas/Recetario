import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from "react-router";
import { useEffect, useState } from 'react';
import { getAllRecipes, getAllRatings, calculateAverageRating } from '../controller/controllerHome';
import { FaUtensilSpoon } from "react-icons/fa";


const Home = () => {

    const navigate = useNavigate();
    const [cards, setCards] = useState([]);

    const handleCardClick = (card) => {
        navigate('/recipe', { state: { cardData: card } });
    };


    useEffect(() => {
        const fetchData = async () => {
            const [recipes, ratings] = await Promise.all([
                getAllRecipes(),
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
        };

        fetchData();
    }, []);


    return (
        <>

            <div className="container-fluid d-flex flex-column align-items-center pt-5 mt-3">
                <div id="carouselExampleInterval" className="carousel slide w-100" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active shadow-sm" data-bs-interval="3000">
                            <img src="https://th.bing.com/th/id/R.31e94b490b92dc5377f4eb3a48976fd2?rik=tuUttqrX6EfH3w&pid=ImgRaw&r=0" className="img-fluid w-100" style={{ height: "350px", objectFit: "cover" }} />
                        </div>
                        <div className="carousel-item shadow-sm" data-bs-interval="3000">
                            <img src="https://oleico.com/wp-content/uploads/2020/05/original-7754e065acbcd16585cf6e3715fade0e.jpeg" className="img-fluid w-100" style={{ height: "350px", objectFit: "cover" }} />
                        </div>
                        <div className="carousel-item shadow-sm" data-bs-interval="3000">
                            <img src="https://www.clara.es/medio/2023/01/12/recetas-saludables_32d84f1c_1200x630.jpg" className="img-fluid w-100" style={{ height: "350px", objectFit: "cover" }} />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            <div className="container-fluid d-flex align-items-center justify-content-center shadow mt-3" style={{ height: "150px", backgroundColor: "#f8f9fa" }}>
                <p className="fs-4 fw-bold fst-italic text-primary text-center m-0">"Descubre las mejores recetas para cada ocasión"</p>
            </div>


            <div className="container-fluid mt-4">
                <div className="row">
                    {cards.map((card, index) => (
                        <div key={index} className="col-md-2 mb-4 d-flex justify-content-center">
                            <div
                                className="card shadow-sm"
                                style={{ width: "12rem", cursor: "pointer", transition: "transform 0.2s" }}
                                onClick={() => handleCardClick(card)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
                            >
                                <img src={card.image} className="card-img-top" alt={card.name} style={{ height: "300px", objectFit: "cover" }} />
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
            </div>

        </>
    );
};

export default Home;
