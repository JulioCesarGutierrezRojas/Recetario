import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from "react-router"; 
import { useState, useEffect } from 'react';
import axios from 'axios'; 

const MyRecipes = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/recipes/"); 
                setRecipes(response.data); 
            } catch (error) {
                console.error("Error al obtener las recetas:", error);
            }
        };

        fetchRecipes(); 
    }, []); 

    const handleCreateRecipe = () => {
        navigate("/recipeform"); 
    };

    const handleEditRecipe = (id) => {
        alert(`Editar receta con ID: ${id}`);
    };

    const handleDeleteRecipe = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/recipes/${id}`); 
            setRecipes(recipes.filter(recipe => recipe.id !== id)); 
        } catch (error) {
            console.error("Error al eliminar la receta:", error);
        }
    };

    return (
        <div className="container mt-4" style={{ paddingTop: '80px' }}>
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
                                    <button className="btn btn-primary" onClick={() => handleEditRecipe(recipe.id)}>Editar</button>
                                    <button className="btn btn-danger" onClick={() => handleDeleteRecipe(recipe.id)}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-primary" onClick={() => navigate("/home")}>Volver al inicio</button>
            </div>
        </div>
    );
};

export default MyRecipes;
