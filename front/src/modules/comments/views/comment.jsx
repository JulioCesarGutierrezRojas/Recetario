import React, { useState } from "react";
import { FaUtensilSpoon } from "react-icons/fa";
import Ratings from '../../ratings/views/Ratings'


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

      {/* Sección para agregar una nueva reseña */}
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

        <button className="btn fw-bolder" type="submit" style={{ backgroundColor: "#007bff", borderColor: "#007bff", color: "#fff" }}>
          Enviar Comentario
        </button>


      </form>

      {/* Sección de comentarios */}
      <h5>Comentarios ({reviews.length}):</h5>
      {reviews.length === 0 ? (
        <p>No hay reseñas aún.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} style={{ borderBottom: "1px solid #ccc", padding: "10px 0" }}>
            <div>
              {/* Mostrar las estrellas de la calificación */}
              {Array.from({ length: review.rating }).map((_, i) => (
                <FaUtensilSpoon key={i} size={20} color="#FFCC00" />
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
