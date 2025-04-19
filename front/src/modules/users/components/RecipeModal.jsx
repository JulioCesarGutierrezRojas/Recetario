import { useState, useEffect } from 'react';
import { RecipeController } from '../adapters/recipeController';
import { showSuccessToast, showWarningToast } from '../../../kernel/alerts';

export const Modal = ({ showModal, setShowModal, selectedRecipe, fetchRecipes }) => {
  const [formData, setFormData] = useState({
    name: '',
    process: '',
    serving_council: '',
    image: null,
    recipe_ingredients: []
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [ingredients, setIngredients] = useState([{ ingredient: '', quantity: '' }]);

  // Function to reset form data to initial state or selected recipe data
  const resetForm = () => {
    if (selectedRecipe) {
      setFormData({
        name: selectedRecipe.name || '',
        process: selectedRecipe.process || '',
        serving_council: selectedRecipe.serving_council || '',
        image: selectedRecipe.image || null,
        recipe_ingredients: selectedRecipe.recipe_ingredients || []
      });

      if (selectedRecipe.recipe_ingredients && selectedRecipe.recipe_ingredients.length > 0) {
        setIngredients(selectedRecipe.recipe_ingredients.map(ing => ({
          ingredient: ing.ingredient || ing.name || '',
          quantity: ing.quantity || ''
        })));
      } else {
        setIngredients([{ ingredient: '', quantity: '' }]);
      }
    } else {
      setFormData({
        name: '',
        process: '',
        serving_council: '',
        image: null,
        recipe_ingredients: []
      });
      setIngredients([{ ingredient: '', quantity: '' }]);
    }
  };

  useEffect(() => {
    resetForm();
    setIsUpdating(!!selectedRecipe);
  }, [selectedRecipe]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files[0]
      }));
    }
  };

  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const newIngredients = [...ingredients];
    newIngredients[index][name] = value;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredient: '', quantity: '' }]);
  };

  const handleRemoveIngredient = (index) => {
    // Prevent removing the last ingredient
    if (ingredients.length <= 1) return;

    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update recipe_ingredients in formData
    const updatedFormData = {
      ...formData,
      recipe_ingredients: ingredients.map(ing => ({
        ingredient: ing.ingredient,
        quantity: ing.quantity
      }))
    };

    try {
      if (isUpdating) {
        // Determine if the image changed
        const imageChanged = updatedFormData.image !== selectedRecipe.image && 
                           !(typeof updatedFormData.image === 'string' && updatedFormData.image === selectedRecipe.image);

        let dataToSend;

        // If image changed and is a File object
        if (imageChanged && typeof updatedFormData.image !== 'string' && updatedFormData.image !== null) {
          const data = new FormData();
          data.append('name', updatedFormData.name);
          data.append('process', updatedFormData.process);
          data.append('serving_council', updatedFormData.serving_council);
          data.append('image', updatedFormData.image);
          data.append('recipe_ingredients', JSON.stringify(updatedFormData.recipe_ingredients));
          dataToSend = data;
        } else {
          // If image didn't change or isn't a File object
          const data = new FormData();
          data.append('name', updatedFormData.name);
          data.append('process', updatedFormData.process);
          data.append('serving_council', updatedFormData.serving_council);
          data.append('recipe_ingredients', JSON.stringify(updatedFormData.recipe_ingredients));

          // Only append image if it's a new File
          if (updatedFormData.image && typeof updatedFormData.image !== 'string') {
            data.append('image', updatedFormData.image);
          }

          dataToSend = data;
        }

        await RecipeController.updateRecipe(selectedRecipe.id, dataToSend);
        showSuccessToast({ title: 'Receta actualizada', text: 'La receta fue actualizada exitosamente.' });
      } else {
        // For creating a new recipe
        const data = new FormData();
        data.append('name', updatedFormData.name);
        data.append('process', updatedFormData.process);
        data.append('serving_council', updatedFormData.serving_council);
        if (updatedFormData.image) {
          data.append('image', updatedFormData.image);
        }
        data.append('recipe_ingredients', JSON.stringify(updatedFormData.recipe_ingredients));

        await RecipeController.createRecipe(data);
        showSuccessToast({ title: 'Receta creada', text: 'La receta fue creada exitosamente.' });

        // Clear the form after successful creation
        setFormData({
          name: '',
          process: '',
          serving_council: '',
          image: null,
          recipe_ingredients: []
        });
        setIngredients([{ ingredient: '', quantity: '' }]);
      }

      // Refresh the recipes list
      await fetchRecipes();
      setShowModal(false);
    } catch (error) {
      showWarningToast({ title: 'Error', text: error.message || 'Error al guardar la receta' });
      console.error('Error al guardar receta:', error);
    }
  };

  // Add backdrop when modal is shown
  useEffect(() => {
    if (showModal) {
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      backdrop.style.zIndex = '1040'; // Set z-index lower than modal
      backdrop.style.pointerEvents = 'none'; // Prevent backdrop from capturing clicks
      document.body.appendChild(backdrop);

      return () => {
        document.body.classList.remove('modal-open');
        if (document.body.contains(backdrop)) {
          document.body.removeChild(backdrop);
        }
      };
    }
  }, [showModal]);

  if (!showModal) return null;

  return (
    <div className="modal fade show" style={{ display: showModal ? 'block' : 'none', zIndex: 1050 }} tabIndex="-1" aria-labelledby="recipeModalLabel" aria-hidden={!showModal}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title" id="recipeModalLabel">
              {isUpdating ? 'Editar Receta' : 'Nueva Receta'}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => {
                resetForm();
                setShowModal(false);
              }}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Proceso</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      name="process"
                      value={formData.process}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Porciones</label>
                    <input
                      type="text"
                      className="form-control"
                      name="serving_council"
                      value={formData.serving_council}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Imagen de la Receta</label>
                    {(formData.image || isUpdating) && (
                      <div className="text-center mb-2">
                        <img
                          src={typeof formData.image === 'string' ? formData.image : (formData.image ? URL.createObjectURL(formData.image) : '')}
                          alt="Vista previa"
                          className="img-fluid rounded shadow-sm"
                          style={{ maxHeight: "200px", objectFit: "cover" }}
                        />
                      </div>
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
                  <div key={index} className="mb-3 p-3 border rounded shadow-sm">
                    <div className="row g-2">
                      <div className="col-md-6">
                        <label className="form-label">Nombre del Ingrediente</label>
                        <input
                          type="text"
                          className="form-control"
                          name="ingredient"
                          value={ingredient.ingredient}
                          onChange={(e) => handleIngredientChange(index, e)}
                          placeholder="Ej: Harina"
                          required
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
                          required
                        />
                      </div>
                      <div className="col-md-2 d-flex align-items-end">
                        <button
                          type="button"
                          className="btn btn-danger w-100"
                          onClick={() => handleRemoveIngredient(index)}
                          disabled={ingredients.length === 1}
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
                <i className="bi bi-plus-circle me-2"></i>Agregar Ingrediente
              </button>

              <div className="modal-footer mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {isUpdating ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
