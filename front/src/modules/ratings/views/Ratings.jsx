import React, { useState } from "react";
import { FaUtensilSpoon } from "react-icons/fa";

const Ratings = ({ rating, setRating, totalSpoons = 5 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div>
      {Array.from({ length: totalSpoons }, (_, index) => {
        const spoonValue = index + 1;
        return (
          <FaUtensilSpoon
            key={index}
            size={30}
            color={spoonValue <= (hoverRating || rating) ? "#FFCC00" : "#e4e5e9"}
            style={{ cursor: "pointer", transition: "color 0.2s ease-in-out" }}
            onClick={() => setRating(spoonValue)} 
            onMouseEnter={() => setHoverRating(spoonValue)} 
            onMouseLeave={() => setHoverRating(0)} 
          />
        );
      })}
    </div>
  );
};

export default Ratings;
