import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { getComments, getRatings, getRecipes } from "../controller/controllerMycomment";

const Mycomment = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchData = async () => {
            const [recipes, comments, ratings] = await Promise.all([
                getRecipes(), 
                getComments(),
                getRatings(),
            ]);

            // Combinar datos por ID (o ajusta esto según tu estructura real)
            const merged = comments.map(comment => {
                const recipe = recipes.find(r => r.id === comment.recipe_id);
                const rating = ratings.find(r => r.comment_id === comment.id);
                return {
                    id: comment.id,
                    name: recipe ? recipe.name : 'Desconocido',
                    comment: comment.content || 'Sin comentario',
                    calification: rating ? rating.value : 'Sin calificación',
                };
            });

            setData(merged);
        };

        fetchData();
    }, []);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = data.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <table className="table table-hover">
                <thead className="thead-light">
                    <tr>
                        <th>Receta</th>
                        <th>Comentarios</th>
                        <th>Calificación</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.comment}</td>
                            <td>{item.calification}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Paginación */}
            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                            Anterior
                        </button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                            <button className="page-link" onClick={() => goToPage(i + 1)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                            Siguiente
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Mycomment;
