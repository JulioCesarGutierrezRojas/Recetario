import React, { useState, useEffect } from "react";
import { FaUtensilSpoon } from "react-icons/fa";
import Ratings from '../../ratings/views/Ratings';
import { createComment, getCommentsByRecipe } from "../../comments/controller/controllerComments";

const CommentSection = ({ reviews, setReviews, recipeId }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getCommentsByRecipe(recipeId);
        setReviews(data);
      } catch (error) {
        console.error("Error al obtener comentarios:", error);
      }
    };

    fetchComments();
  }, [recipeId, setReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim() === "" || rating === 0) return;

    setIsSubmitting(true);

    try {
      // The createComment function now returns a properly structured comment object
      const newComment = await createComment(recipeId, comment, rating);

      // Add the new comment to the beginning of the reviews array
      setReviews([newComment, ...reviews]);

      // Reset the form
      setComment("");
      setRating(0);
    } catch (error) {
      console.error("Error al enviar comentario o calificación:", error);
      alert("Algo salió mal, inténtalo más tarde.");
    }

    setIsSubmitting(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", textAlign: "left" }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <h4 className='fw-bold'>Deja tu calificación:</h4>
        <Ratings rating={rating} setRating={setRating} />

        <textarea
          placeholder="Escribe tu comentario aquí..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        ></textarea>

        <button
          className="btn fw-bolder mt-2"
          type="submit"
          disabled={isSubmitting || rating === 0 || comment.trim() === ""}
          style={{ backgroundColor: "#007bff", borderColor: "#007bff", color: "#fff" }}
        >
          {isSubmitting ? "Enviando..." : "Enviar Comentario"}
        </button>
      </form>

      <h5>Comentarios y Calificaciones ({reviews.length}):</h5>
      {reviews.length === 0 ? (
        <p>No hay reseñas aún.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} style={{ 
            borderBottom: "1px solid #ccc", 
            padding: "10px 0",
            backgroundColor: review.isRatingOnly ? "#f8f9fa" : "transparent"
          }}>
            <div>
              {review.rating || review.calification
                ? Array.from({ length: review.rating || review.calification }).map((_, i) => (
                  <FaUtensilSpoon key={i} size={20} color="#FFCC00" />
                ))
                : <span style={{ color: "#ccc" }}>Sin calificación</span>}
            </div>
            <p>{review.isRatingOnly ? "Solo calificación" : (review.comment || review.text || "Comentario vacío")}</p>
            <div style={{ fontSize: "0.85em", color: "#666" }}>
              {new Date(review.created_at).toLocaleString("es-MX", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentSection;
