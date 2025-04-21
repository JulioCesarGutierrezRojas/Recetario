import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { getComments, getRatings, getRecipes } from "../controller/controllerMycomment";
import { handleRequest } from '../../../config/http-client.gateway';
import { useNavigate } from "react-router";
import Swal from 'sweetalert2';
import { showSuccessToast, showErrorToast } from "../../../kernel/alerts";

const Mycomment = () => {
    const navigate = useNavigate();
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

            const merged = comments.map(comment => {
                const recipe = recipes.find(r => r.id === comment.recipe);

                const rating = ratings.find(r => r.id === comment.id);
                return {
                    id: comment.id,
                    name: recipe ? recipe.name : 'Desconocido',
                    comment: comment.comment || 'Sin comentario',
                    calification: rating ? rating.calification : 'Sin calificación',
                    ratingId: rating ? rating.id : null,
                    recipeId: comment.recipe,
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

    const handleBackHome = () => {
        navigate("/home");
    };

    const [editItem, setEditItem] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [newCalification, setNewCalification] = useState("");

    const handleEdit = (item) => {
        setEditItem(item);
        setNewComment(item.comment);
        setNewCalification(item.calification);
        const modalElement = document.getElementById("editModal");
        const modal = new window.bootstrap.Modal(modalElement);
        modal.show();
    };

    const handleSaveEdit = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Se actualizarán el comentario y la calificación",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                const userId = parseInt(localStorage.getItem('user-id'), 10);

                await handleRequest('put', `/comments/${editItem.id}/`, { 
                    comment: newComment,
                    user: userId,
                    recipe: editItem.recipeId
                });

                await handleRequest('put', `/ratings/${editItem.ratingId}/`, { 
                    calification: newCalification,
                    user: userId,
                    recipe: editItem.recipeId
                });

                setData(prev => prev.map(item =>
                    item.id === editItem.id
                        ? { ...item, comment: newComment, calification: newCalification }
                        : item
                ));

                const modal = window.bootstrap.Modal.getInstance(document.getElementById('editModal'));
                modal.hide();
                setEditItem(null);

                showSuccessToast({ 
                    title: "Actualizado con éxito", 
                    text: "El comentario y la calificación han sido actualizados" 
                });
            } catch (error) {
                console.error("Error al editar:", error);
                showErrorToast({ 
                    title: "Error", 
                    text: "No se pudo actualizar el comentario. Intente nuevamente." 
                });
            }
        }
    };

    const handleDelete = async (commentId, ratingId) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Este comentario y su calificación serán eliminados permanentemente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                const commentResponse = await handleRequest('delete', `/comments/${commentId}/`);

                // Only attempt to delete the rating if ratingId exists
                if (ratingId) {
                    await handleRequest('delete', `/ratings/${ratingId}/`);
                }

                setData(prev => prev.filter(item => item.id !== commentId));

                showSuccessToast({ 
                    title: "Eliminado con éxito", 
                    text: "El comentario y su calificación han sido eliminados" 
                });
            } catch (error) {
                console.error("Error al eliminar:", error);
                showErrorToast({ 
                    title: "Error", 
                    text: "No se pudo eliminar el comentario. Intente nuevamente." 
                });
            }
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold">Mis comentarios realizados</h1>
                <button className="btn btn-secondary" onClick={handleBackHome}>Regresar al Menú</button>
            </div>
            <table className="table table-hover mt-5">
                <thead className="thead-light">
                    <tr>
                        <th>Receta</th>
                        <th>Comentarios</th>
                        <th>Calificación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.comment}</td>
                            <td>{item.calification}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(item)}>Editar</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id, item.ratingId)}>Eliminar</button>
                            </td>
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

            <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editModalLabel">Editar Comentario y Calificación</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Comentario</label>
                                <input type="text" className="form-control" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Calificación</label>
                                <input type="number" className="form-control" min="1" max="5" value={newCalification} onChange={(e) => setNewCalification(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>Guardar cambios</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Mycomment;
