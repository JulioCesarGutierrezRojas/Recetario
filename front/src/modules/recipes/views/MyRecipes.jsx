import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from "react-router";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { showErrorToast, showSuccessToast } from "../../../kernel/alerts";
import { getRecipes, updateRecipe, deleteRecipe } from "../controller/controllerMyrecipes";
import { validateNonEmpty, validateNoExcessiveRepetition } from "../../../kernel/validations";


const MyRecipes = () => {

    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [title, setTitle] = useState('');
    const [process, setProcess] = useState('');
    const [tips, setTips] = useState('');
    const [image, setImage] = useState(null);
    const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await getRecipes();
                const recipesData = Array.isArray(response) ? response : [];
                setRecipes(recipesData);
            } catch (error) {
                console.error("Error al cargar recetas:", error);
                setRecipes([]);
            }
        };
        fetchRecipes();
    }, []);

    const handleCreateRecipe = () => {
        navigate("/recipeform");
    };

    const handleBackHome = () => {
        navigate("/home");
    };

    const handleEditRecipe = async (recipe) => {
        console.log("Recipe data received:", recipe); // Para depuración
        
        setSelectedRecipe(recipe);
        setTitle(recipe.name);
        setProcess(recipe.process);
        setTips(recipe.serving_council);
    
        let mappedIngredients = [];
    
        if (recipe.recipe_ingredients?.length > 0) {
            mappedIngredients = recipe.recipe_ingredients.map(item => {
                console.log("Current ingredient item:", item); // Para depuración
                return {
                    name: item.ingredient?.name || item.ingredient || "",
                    quantity: item.quantity || "",
                    id: item.id || undefined
                };
            });
        } else {
            mappedIngredients = [{ name: "", quantity: "" }];
        }
    
        console.log("Mapped ingredients:", mappedIngredients); // Para ver el resultado
        setIngredients(mappedIngredients);
        setImage(recipe.image);
    };
    
    const handleIngredientChange = (index, event) => {
        const newIngredients = [...ingredients];
        newIngredients[index][event.target.name] = event.target.value;
        setIngredients(newIngredients);
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: "", quantity: "" }]);
    };

    const handleRemoveIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleImageChange = (event) => {
        if (event.target.files?.[0]) {
            setImage(event.target.files[0]);
        }
    };

    const handleDeleteRecipe = async (id) => {
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
                const response = await deleteRecipe(id);

                if (response.type === 'SUCCESS') {
                    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
                    showSuccessToast({ title: "Receta eliminada", text: "¡Éxito!" });
                } else {
                    throw new Error(response.text);
                }
            } catch (error) {
                showErrorToast({ title: "Error", text: error.message || "Error al eliminar la receta." });
            }
        }
    };

    const handleSaveEdit = async () => {

        const errors = [
            validateNonEmpty(title, "Título"),
            validateNoExcessiveRepetition(title, "Título"),
            validateNonEmpty(process, "Proceso"),
            validateNoExcessiveRepetition(process, "Proceso"),
            validateNonEmpty(tips, "Consejos para Servir"),
            validateNoExcessiveRepetition(tips, "Consejos para Servir")
        ].filter(Boolean); 
        
        if (errors.length > 0) {
            showErrorToast({
                title: "Validación",
                text: errors.join("\n")
            });
            return; 
        }

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
                // Determinar si la imagen cambió
                const imageChanged = image !== selectedRecipe.image && 
                                   !(typeof image === 'string' && image === selectedRecipe.image);
    
                // Preparar los datos según si hay imagen nueva o no
                let dataToSend;
                const payload = {
                    name: title,
                    process: process,
                    serving_council: tips,
                    ingredients: ingredients
                        .filter(ing => ing.name.trim() !== "" && ing.quantity.trim() !== "")
                        .map(ing => ({
                            name: ing.name.replace('Ingrediente #', ''),
                            quantity: parseFloat(ing.quantity) || 0
                        }))
                };
    
                
                if (imageChanged && image instanceof File) {
                    const formData = new FormData();
                    Object.entries(payload).forEach(([key, value]) => {
                        if (key === 'ingredients') {
                            formData.append(key, JSON.stringify(value));
                        } else {
                            formData.append(key, value);
                        }
                    });
                    formData.append('image', image);
                    dataToSend = formData;
                } 
    
                else {
                    dataToSend = {
                        ...payload,
                        image: imageChanged ? image : null 
                    };
                }
    
               
    
                const response = await updateRecipe(selectedRecipe.id, dataToSend);
    
                if (!response || response.error) {
                    throw new Error(response?.error || "Error al actualizar la receta");
                }
    
                showSuccessToast({ title: "Receta actualizada", text: "¡Éxito!" });
    
                // Actualizar lista y cerrar modal
                const freshRecipes = await getRecipes();
                setRecipes(freshRecipes);
                
                const modal = document.getElementById('editRecipeModal');
                if (modal) {
                    modal.style.display = 'none';
                    document.body.classList.remove('modal-open');
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) backdrop.remove();
                }
    
            } catch (error) {
                console.error("Error completo:", error.response?.data || error);
                showErrorToast({
                    title: "Error",
                    text: error.response?.data?.message || 
                         "Error al actualizar la receta. Verifica los datos."
                });
            }
        }
    };

    return (
        <div className="container pt-5 mt-4" style={{ paddingTop: '120px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Mis Recetas</h1>
                <div className="d-flex gap-2">
                    <button className="btn btn-secondary" onClick={handleCreateRecipe}>Crear Receta</button>
                    <button className="btn btn-secondary" onClick={handleBackHome}>Regresar al Menú</button>
                </div>
            </div>

            <div className="row">
                {recipes.map(recipe => (
                    <div key={recipe.id} className="col-md-4 mb-4">
                        <div className="card shadow-sm">
                            <img
                                src={recipe.image}
                                alt={recipe.name}
                                className="card-img-top"
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{recipe.name}</h5>
                                <p className="card-text">{recipe.process}</p>

                                <div className="d-flex justify-content-between">
                                    <button
                                        className="btn btn-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target="#editRecipeModal"
                                        onClick={() => handleEditRecipe(recipe)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteRecipe(recipe.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de edición */}
            <div className="modal fade" id="editRecipeModal" tabIndex="-1" aria-labelledby="editRecipeModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editRecipeModalLabel">Editar Receta</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Título</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Proceso</label>
                                        <textarea
                                            className="form-control"
                                            rows="5"
                                            value={process}
                                            onChange={(e) => setProcess(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Consejos para Servir</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={tips}
                                            onChange={(e) => setTips(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Imagen de la Receta</label>
                                        {image && (
                                            <img
                                                src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                                alt="Vista previa"
                                                className="img-fluid mb-2 rounded"
                                                style={{ maxHeight: "200px" }}
                                            />
                                        )}
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <h4 className="mt-4">Ingredientes</h4>
                            <div className="ingredients-container">
                                {ingredients.map((ingredient, index) => (
                                    <div key={index} className="mb-3 p-3 border rounded">
                                        <div className="row g-2">
                                            <div className="col-md-6">
                                                <label className="form-label">Nombre del Ingrediente</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="name"
                                                    value={ingredient.name}
                                                    onChange={(e) => handleIngredientChange(index, e)}
                                                    placeholder="Ej: Harina"
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Cantidad</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="quantity"
                                                    value={ingredient.quantity}
                                                    onChange={(e) => handleIngredientChange(index, e)}
                                                    placeholder="Ej: 200g"
                                                />
                                            </div>
                                            <div className="col-md-2 d-flex align-items-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger w-100"
                                                    onClick={() => handleRemoveIngredient(index)}
                                                >
                                                    <i className="bi bi-trash"></i> Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary mt-2"
                                onClick={handleAddIngredient}
                            >
                                <i className="bi bi-plus"></i> Agregar Ingrediente
                            </button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyRecipes;