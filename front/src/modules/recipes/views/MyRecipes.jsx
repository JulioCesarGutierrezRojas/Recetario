import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from "react-router";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getRecipes} from "../controller/controllerRecipeForm";


const MyRecipes = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [title, setTitle] = useState('');
    const [process, setProcess] = useState('');
    const [tips, setTips] = useState('');
    const [image, setImage] = useState(null);
    const [ingredients, setIngredients] = useState([{ ingredient: "", quantity: "" }]);

    useEffect(() => {
        const fetchRecipes = async () => {
          try {
            const data = await getRecipes();
            setRecipes(data);
          } catch (error) {
            console.error("Error al cargar las recetas:", error);
          }
        };
    
        fetchRecipes();
      }, []);

    const handleCreateRecipe = () => {
        navigate("/recipeform");
    };

    const handleEditRecipe = (recipe) => {
        setSelectedRecipe(recipe);
        setTitle(recipe.name);
        setProcess(recipe.process);
        setTips(recipe.serving_council);
        setIngredients(recipe.ingredients || [{ ingredient: "", quantity: "" }]);
        setImage(null); // Resetear la imagen al editar
    };

    const handleDeleteRecipe = async (id) => {
        // Mostrar SweetAlert para confirmar la eliminación
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta receta será eliminada permanentemente!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });
    
        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`http://localhost:8000/api/recipes/${id}/`);
                if (response.status === 204) { // HTTP 204 significa "No Content", eliminación exitosa
                    setRecipes(recipes.filter(recipe => recipe.id !== id));
                    Swal.fire(
                        'Eliminado!',
                        'La receta ha sido eliminada.',
                        'success'
                    );
                } else {
                    console.error('Error al eliminar la receta:', response.data);
                }
            } catch (error) {
                console.error("Error al eliminar la receta:", error.response ? error.response.data : error.message);
                Swal.fire(
                    'Error!',
                    'Hubo un error al eliminar la receta.',
                    'error'
                );
            }
        } else {
            console.log("Eliminación cancelada.");
        }
    };
    
    

    const handleIngredientChange = (index, event) => {
        const newIngredients = [...ingredients];
        newIngredients[index][event.target.name] = event.target.value;
        setIngredients(newIngredients);
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { ingredient: "", quantity: "" }]);
    };

    const handleRemoveIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSaveEdit = async () => {
        if (!selectedRecipe) return;
    
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Se actualizarán los datos de la receta.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });
    
        if (result.isConfirmed) {
            try {
                const formData = new FormData();
                formData.append("name", title);
                formData.append("process", process);
                formData.append("serving_council", tips);
                if (image) {
                    formData.append("image", image);
                }
    
                // Actualizar receta
                await axios.put(`http://localhost:8000/api/recipes/${selectedRecipe.id}/`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
    
                // Actualizar o agregar ingredientes
                await Promise.all(
                    ingredients.map(async (ingredient) => {
                        if (!ingredient.ingredient || !ingredient.quantity) return;
    
                        if (ingredient.id) {
                            // Actualizar ingrediente existente
                            await axios.put(`http://localhost:8000/api/ingredients/${ingredient.id}/`, {
                                name: ingredient.ingredient,
                                quantity: ingredient.quantity,
                            });
                        } else {
                            // Crear nuevo ingrediente
                            await axios.post(`http://localhost:8000/api/ingredients/`, {
                                name: ingredient.ingredient,
                                quantity: ingredient.quantity,
                                recipe: selectedRecipe.id,
                            });
                        }
                    })
                );
    
                Swal.fire("¡Éxito!", "Receta actualizada correctamente.", "success");
    
                // Refrescar la lista de recetas después de editar
                const response = await axios.get("http://localhost:8000/api/recipes/");
                setRecipes(response.data);
    
            } catch (error) {
                console.error("Error al actualizar la receta:", error.response?.data || error);
                Swal.fire("Error", "No se pudo actualizar la receta.", "error");
            }
        } else {
            console.log("Actualización cancelada.");
        }
    };
    
    

    return (
        <div className="container pt-5 mt-4" style={{ paddingTop: '120px' }}>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Mis Recetas</h1>
                <button className="btn btn-success" onClick={handleCreateRecipe}>Crear Receta</button>
            </div>
            <div className="row">
                {recipes.map(recipe => (
                    <div key={recipe.id} className="col-md-4 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">{recipe.name}</h5>
                                <img src={recipe.image} alt={recipe.name} className="card-img-top" />
                                <p className="card-text">{recipe.description}</p>
                                <div className="d-flex justify-content-between">
                                    <button
                                        className="btn btn-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target="#editRecipeModal"
                                        onClick={() => handleEditRecipe(recipe)}
                                    >
                                        Editar
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteRecipe(recipe.id)}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de edición de receta */}
            <div className="modal fade" id="editRecipeModal" tabIndex="-1" aria-labelledby="editRecipeModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editRecipeModalLabel">Editar Receta</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Título</label>
                                <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Proceso</label>
                                <textarea className="form-control" value={process} onChange={(e) => setProcess(e.target.value)}></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Consejos para Servir</label>
                                <textarea className="form-control" value={tips} onChange={(e) => setTips(e.target.value)}></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Imagen de la Receta</label>
                                <input type="file" className="form-control" onChange={handleImageChange} />
                            </div>

                            <h4>Ingredientes</h4>
                            {ingredients.map((ingredient, index) => (
                                <div key={index} className="mb-3">
                                    <div className="d-flex justify-content-between">
                                        <div className="w-50">
                                            <label className="form-label">Ingrediente</label>
                                            <input type="text" className="form-control" name="ingredient" value={ingredient.ingredient} onChange={(e) => handleIngredientChange(index, e)} />
                                        </div>
                                        <div className="w-50">
                                            <label className="form-label">Cantidad</label>
                                            <input type="text" className="form-control" name="quantity" value={ingredient.quantity} onChange={(e) => handleIngredientChange(index, e)} />
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-danger" onClick={() => handleRemoveIngredient(index)}>Eliminar ingrediente</button>
                                </div>
                            ))}
                            <button type="button" className="btn btn-primary" onClick={handleAddIngredient}>Agregar Ingrediente</button>
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

export default MyRecipes;
