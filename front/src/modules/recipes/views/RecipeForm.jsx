import { useState } from "react";
import { showErrorToast, showSuccessToast } from "../../../kernel/alerts";
import { getIngredients, createIngredient, createRecipe, associateIngredientsWithRecipe } from "../controller/controllerRecipeForm";
import { useNavigate } from "react-router-dom"; 
import { validateNonEmpty, validateImage, validateQuantity } from "../../../kernel/validations"; 

const RecipeForm = () => {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [process, setProcess] = useState("");
  const [tips, setTips] = useState("");
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState([{ ingredient: "", quantity: "" }]);

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
    if (event.target.files.length > 0) {
      setImage(event.target.files[0]); 
    } else {
      setImage(null); 
    }
  };
  

  // Función para verificar si el ingrediente existe y crear uno nuevo si es necesario
const createIngredientIfNeeded = async (ingredientName) => {
  try {
    const existingIngredients = await getIngredients(); 
    let foundIngredient = existingIngredients.find(
      (ing) => ing.name.toLowerCase() === ingredientName.toLowerCase()
    );

    if (!foundIngredient) {
      
      const newIngredient = await createIngredient(ingredientName);
      foundIngredient = newIngredient;
    }

    return foundIngredient;
  } catch (error) {
    console.error("Error al crear o buscar ingrediente:", error);
    throw new Error("Error al crear o buscar ingrediente.");
  }
};




const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    // Validación de campos vacíos o solo espacios en blanco
    if (
      validateNonEmpty(title, "Título") ||
      validateNonEmpty(process, "Proceso") ||
      validateNonEmpty(tips, "Consejos para Servir") ||
      !image
    ) {
      throw new Error("Todos los campos son obligatorios y no pueden estar vacíos.");
    }

    // Validación de imagen
    const imageError = validateImage(image);
    if (imageError) {
      throw new Error(imageError);
    }

    // Validación de ingredientes
    const invalidIngredient = ingredients.find((ingredient, index) => {
      const ingredientError = validateNonEmpty(ingredient.ingredient, `Ingrediente ${index + 1}`);
      const quantityError = validateQuantity(ingredient.quantity);
      if (ingredientError || quantityError) {
        return true;
      }
      return false;
    });

    if (invalidIngredient) {
      throw new Error("Hay errores en los ingredientes. Verifica los campos.");
    }

    const ingredientsData = ingredients.map(ing => ({
      ingredient: ing.ingredient,
      quantity: ing.quantity,
    }));

    const formData = new FormData();
    formData.append("name", title);
    formData.append("process", process);
    formData.append("serving_council", tips); 
    formData.append("image", image);
    formData.append("recipe_ingredients", JSON.stringify(ingredientsData));



    const recipeResponse = await createRecipe(formData);
    showSuccessToast({ title: "Receta creada", text: "¡Éxito!" });

    setTimeout(() => {
      navigate('/myrecipes');
    }, 1500);

  } catch (error) {
    console.error("Error al crear la receta:", error.response?.data || error.message);
    showErrorToast({ title: "Error", text: error.message || "Error al crear la receta." });
  }
};

const handleBackHome = () => {
  navigate("/home");
};

  return (
    <div className="container pt-5 mt-4">
      <br></br>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Crear Receta</h2>
        <div className="d-flex gap-2">  
          <button className="btn btn-secondary" onClick={handleBackHome}>Regresar al Menú</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Proceso</label>
          <textarea className="form-control" value={process} onChange={(e) => setProcess(e.target.value)} required></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Consejos para Servir</label>
          <textarea className="form-control" value={tips} onChange={(e) => setTips(e.target.value)} required></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Imagen de la Receta</label>
          <input type="file" className="form-control" onChange={handleImageChange} required />
        </div>

        <h4>Ingredientes</h4>
        {ingredients.map((ingredient, index) => (
          <div key={index} className="mb-3">
            <div className="d-flex justify-content-between">
              <div className="w-50">
                <label className="form-label">Ingrediente</label>
                <input type="text" className="form-control" name="ingredient" value={ingredient.ingredient} onChange={(e) => handleIngredientChange(index, e)} required />
              </div>
              <div className="w-50">
                <label className="form-label">Cantidad</label>
                <input type="text" className="form-control" name="quantity" value={ingredient.quantity} onChange={(e) => handleIngredientChange(index, e)} required />
              </div>
            </div>
            <button type="button" className="btn btn-danger" onClick={() => handleRemoveIngredient(index)}>Eliminar ingrediente</button>
          </div>
        ))}
        <button type="button" className="btn btn-primary" onClick={handleAddIngredient}>Agregar Ingrediente</button>

        <div className="mt-3">
          <button type="submit" className="btn btn-success">Crear Receta</button>
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
