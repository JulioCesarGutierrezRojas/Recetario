import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate } from "react-router"; // Asegúrate de importar useNavigate desde react-router-dom
import { useState } from 'react';

const MyRecipes = () => {
    console.log("MyRecipes se ha renderizado");

    const navigate = useNavigate(); // Instanciamos el hook useNavigate
    const [recipes, setRecipes] = useState([]);

    const handleCreateRecipe = () => {
        navigate("/recipeform"); // Redirige a la página de creación de recetas
    };

    const handleEditRecipe = (id) => {
        alert(`Editar receta con ID: ${id}`);
    };

    const handleDeleteRecipe = (id) => {
        setRecipes(recipes.filter(recipe => recipe.id !== id));
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
                                <h5 className="card-title">{recipe.title}</h5>
                                <img src={recipe.image} alt={recipe.title} className="card-img-top" />
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
