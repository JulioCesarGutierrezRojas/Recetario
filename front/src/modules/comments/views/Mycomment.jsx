import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Mycomment = () => {
    const Comments = [
        { id: 1, recipe: "Pizza", rating: "5", comment: "Delicious!" },
        { id: 2, recipe: "Pasta", rating: "4", comment: "Tasty but a bit salty." },
        { id: 3, recipe: "Burger", rating: "5", comment: "Perfect!" },
        { id: 4, recipe: "Salad", rating: "3", comment: "Fresh but boring." },
        { id: 5, recipe: "Sushi", rating: "5", comment: "Amazing!" },
        { id: 6, recipe: "Soup", rating: "4", comment: "Warm and comforting." },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const totalPages = Math.ceil(Comments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = Comments.slice(startIndex, startIndex + itemsPerPage);

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
                        <th>ID</th>
                        <th>Receta</th>
                        <th>Calificación</th>
                        <th>Comentarios</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.recipe}</td>
                            <td>{item.rating}</td>
                            <td>{item.comment}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


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
