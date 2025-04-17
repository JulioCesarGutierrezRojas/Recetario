import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from "react-router";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { showErrorToast, showSuccessToast } from "../../../kernel/alerts";
import { getRecipes, updateRecipe, deleteRecipe } from "../controller/controllerMyrecipes";


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
                const data = await getRecipes();
                // console.log("Datos de recetas recibidos:", data); // Para debug
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

   
    
    const handleEditRecipe = async (recipe) => {
        // console.log("Receta seleccionada:", recipe);
        setSelectedRecipe(recipe);
        setTitle(recipe.name);
        setProcess(recipe.process);
        setTips(recipe.serving_council);
    
        let mappedIngredients = [];
        
        if (recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0) {
            mappedIngredients = recipe.recipe_ingredients.map(item => {
                if (typeof item.ingredient === 'object' && item.ingredient.name) {
                    return {
                        name: item.ingredient.name,
                        quantity: item.quantity || "",
                        id: item.id
                    };
                }
                return {
                    name: `Ingrediente #${item.ingredient}`, 
                    quantity: item.quantity || "",
                    id: item.id
                };
            });
        } else {
            mappedIngredients = [{ name: "", quantity: "" }];
        }
    
       // console.log("Ingredientes mapeados:", mappedIngredients);
        setIngredients(mappedIngredients);
        setImage(recipe.image);
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
                await deleteRecipe(id); // Usando la función del controlador
                setRecipes(recipes.filter(recipe => recipe.id !== id));
                showSuccessToast({ title: "Receta eliminada", text: "¡Éxito!" });
            } catch (error) {
                console.error("Error al eliminar:", error);
                showErrorToast({ title: "Error", text: error.message || "Error al eliminar la receta." });
            }
        }
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
            const recipeData = {
              name: title,
              process: process,
              serving_council: tips,
              image: image,
              ingredients: ingredients
                .filter(ing => ing.name.trim() !== "" && ing.quantity.trim() !== "")
                .map(ing => ({
                  name: ing.name,
                  quantity: ing.quantity
                }))
            };
      
           // console.log("Datos a enviar:", recipeData);
            
            const updatedRecipe = await updateRecipe(selectedRecipe.id, recipeData);
            
            showSuccessToast({ title: "Receta actualizada", text: "¡Éxito!" });
            
            const freshRecipes = await getRecipes();
            setRecipes(freshRecipes);
    
            const modalElement = document.getElementById('editRecipeModal');
            if (modalElement) {
              modalElement.classList.remove('show');
              modalElement.style.display = 'none';
              document.body.classList.remove('modal-open');
              const backdrop = document.querySelector('.modal-backdrop');
              if (backdrop) backdrop.remove();
            }
            
      
      
          } catch (error) {
            console.error("Error en la actualización:", error);
            
            
            let errorDetails = "Error desconocido";
            if (error.response) {
              errorDetails = `
                Estado: ${error.response.status}
                Mensaje: ${JSON.stringify(error.response.data, null, 2)}
              `;
            } else if (error.message) {
              errorDetails = error.message;
            }
      
            showErrorToast({ title: "Error", text: error.message || "Error al actualizar la receta." });
          }
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