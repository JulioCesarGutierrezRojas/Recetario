import { useEffect, useState } from 'react';
import { RecipeController } from '../adapters/recipeController';
import { Modal } from '../components/RecipeModal';
import { Edit, Trash2 } from 'react-feather';
import { showConfirmation, showSuccessToast, showWarningToast } from '../../../kernel/alerts';
import Loader from '../../../components/Loader';
import { useNavigate } from 'react-router';



export const RecipesList = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await RecipeController.getRecipes();
      setRecipes(response.result || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    showConfirmation('¿Eliminar receta?', 'Esta acción no se puede deshacer.', 'warning', () => onDelete(id));
  };

  const onDelete = async (id) => {
    setLoading(true);
    try {
      await RecipeController.deleteRecipe(id);
      showSuccessToast({ title: 'Receta eliminada', text: 'La receta fue eliminada exitosamente.' });
      // Refresh the recipes list after successful deletion
      await fetchRecipes();
    } catch (error) {
      showWarningToast({ title: 'Error', text: error.message });
      // Still try to refresh the recipes list even if there was an error
      await fetchRecipes();
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecipe = (recipe) => {
    navigate('/recipe', { state: { cardData: recipe } });
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="container mt-5">
      <Loader isLoading={loading} />
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="display-5 text-success mt-5">Lista de Recetas</h1>
        <button className="btn btn-primary fw-bold shadow rounded-3"
          onClick={() => {
            setSelectedRecipe(null);
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>Nueva Receta
        </button>
      </div>

      <div className="container-fluid mt-4">
        <div className="row">
          {recipes.length === 0 ? (
            <div className="col-12 text-center">
              <span className="text-danger fs-5">No hay recetas registradas</span>
            </div>
          ) : (
            recipes.map((recipe, index) => (
              <div key={index} className="col-md-3 mb-4 d-flex justify-content-center">
                <div 
                  className="card shadow-sm"
                  style={{ width: "18rem", transition: "transform 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1.0)"}
                >
                  <img 
                    src={recipe.image} 
                    className="card-img-top" 
                    alt={recipe.name} 
                    style={{ height: "300px", objectFit: "cover", cursor: "pointer" }}
                    onClick={() => handleViewRecipe(recipe)}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title fw-bold">{recipe.name}</h5>
                    <p className="card-text text-muted">Porciones: {recipe.serving_council}</p>
                    <div className="d-flex justify-content-center gap-2 mt-3">
                      <button className="btn btn-sm btn-outline-warning" onClick={() => {
                        setSelectedRecipe(recipe);
                        setShowModal(true);
                      }}>
                        <Edit size={20} />
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(recipe.id)}>
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRecipe={selectedRecipe}
        fetchRecipes={fetchRecipes}
      />
    </div>
  );
};
