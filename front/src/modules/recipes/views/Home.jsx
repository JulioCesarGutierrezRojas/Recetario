import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from "react-router";


const Home = () => {

    const navigate = useNavigate(); 

    const handleCardClick = (card) => {            
        navigate('/recipe', { state: { cardData: card } }); 
    };

    
    const cards = [
        { id:1, img: "https://th.bing.com/th/id/OIP.Mtf9PbdilctLdro-wIWBVgHaFC?rs=1&pid=ImgDetMain", title: "Papas Fritas" },
        { id:2, img: "https://cdn2.cocinadelirante.com/sites/default/files/images/2018/09/receta-super-facil-de-carne-para-hamburguesa-suave.jpg", title: "Hamburguesa" },
        { id:3, img: "https://media.istockphoto.com/photos/pizza-slice-serving-with-a-spatula-human-hand-picture-id1198287094?k=20&m=1198287094&s=612x612&w=0&h=4n5BWyUKVBeuRNv6T_AWNxZtPjx2oueqPEO8NJw1hUE=", title: "Pizza" },
        { id:4, img: "https://th.bing.com/th/id/OIP.JZBaB6tNbzVYMRcGw94igQHaE8?rs=1&pid=ImgDetMain", title: "Chilaquiles" },
        { id:5, img: "https://www.cucinare.tv/wp-content/uploads/2019/11/Huevos-revueltos.jpg", title: "Huevos Revueltos" },
        { id:6, img: "https://www.tuhogar.com/content/dam/cp-sites/home-care/tu-hogar/es_mx/recetas/comida-saludable/como-hacer-espagueti-verde/espagueti-verde-axion.jpg", title: "Espagueti Verde" },
        { id:7, img: "https://th.bing.com/th/id/R.b5e8eb9a8aa7bf32507616f721eb1618?rik=mGTHNsiSO4eNYw&pid=ImgRaw&r=0", title: "Ensalada" },
        { id:8, img: "https://th.bing.com/th/id/OIP.3qiOYdcpu2jl8G9ln1phLgHaE8?rs=1&pid=ImgDetMain", title: "Pasta" },
        { id:9, img: "https://th.bing.com/th/id/OIP.RnhSWftBqWsFnQsWp3j0rAHaE8?rs=1&pid=ImgDetMain", title: "Helado" },
        { id:10, img: "https://th.bing.com/th/id/OIP.BMUowKE-Dg7yCaKZ_OEOlQHaE8?rs=1&pid=ImgDetMain", title: "Hot Cakes" },
        { id:11, img: "https://th.bing.com/th/id/R.b5c8425f3ca5728ce7d1fc2ce0821103?rik=Yj9OLeKPjcqxDg&pid=ImgRaw&r=0", title: "Sushi" },
        { id:12, img: "https://www.gastrolabweb.com/u/fotografias/m/2021/7/7/f800x450-15913_67359_5050.jpg", title: "Calabazas Rellenas" },
    ];

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
                                <img src={card.img} className="card-img-top" alt={card.title} style={{ height: "300px", objectFit: "cover" }} />
                                <div className="card-body text-center">
                                    <p className="card-title fw-bold">{card.title}</p>
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
