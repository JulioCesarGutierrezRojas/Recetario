import React, { useState } from "react";
import Ratings from "../../ratings/views/rating";
import { FaUtensilSpoon } from "react-icons/fa";



const CommentSection = ({ reviews, setReviews }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();


    if (comment.trim() === "" || rating === 0) return;

    const newReview = {
      id: Date.now(),
      comment,
      rating,
    };


    setReviews([newReview, ...reviews]);


    setComment("");
    setRating(0);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", textAlign: "left" }}>
      <h2>Reseñas de clientes</h2>

      {/* Sección para agregar una nueva reseña */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <h4>Deja tu calificación:</h4>
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
          className="btn"
          type="submit"
          style={{ backgroundColor: "#007bff", borderColor: "#007bff", color: "#fff" }}
        >
          Enviar Reseña
        </button>


      </form>

      {/* Sección de comentarios */}
      <h3>Reseñas ({reviews.length})</h3>
      {reviews.length === 0 ? (
        <p>No hay reseñas aún.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
            <div>
              {/* Mostrar las estrellas de la calificación */}
              {Array.from({ length: review.rating }).map((_, i) => (
                <FaUtensilSpoon key={i} size={20} color="#8B4513" />
              ))}
            </div>
            <p>{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentSection;
