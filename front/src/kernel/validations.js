
export const validateEmail = (email) => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    return emailRegex.test(email) && !email.includes(' ');
};

export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{8,}$/;
    return passwordRegex.test(password);
};

export const validateRegisterForm = (formData) => {
    const errors = {};

    if (!formData.name.trim()) {
        errors.name = "El nombre no puede estar vacío";
    }

    if (!formData.email.trim()) {
        errors.email = "El correo no puede estar vacío";
    } else if (!validateEmail(formData.email)) {
        errors.email = "Correo no válido";
    }

    if (formData.email.includes(' ')) {
        errors.email = "El correo no debe contener espacios";
    }

    if (!formData.password.trim()) {
        errors.password = "La contraseña no puede estar vacía";
    } else if (!validatePassword(formData.password)) {
        errors.password = "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial";
    }

    if (!formData.confirmPassword.trim()) {
        errors.confirmPassword = "Debes confirmar tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!formData.gender.trim()) {
        errors.gender = "Selecciona un género";
    }

    return errors;
};

// Validación de campos vacíos o solo espacios en blanco
export const validateNonEmpty = (value, fieldName) => {
    if (!value.trim()) {
      return `${fieldName} no puede estar vacío o contener solo espacios`;
    }
    return null;
  };
  
  // Validación de imagen (debe ser tipo 'image/*')
  export const validateImage = (file) => {
    if (file && !file.type.startsWith('image/')) {
      return "El archivo debe ser una imagen";
    }
    return null;
  };
  
  // Validación para cantidad de ingrediente (solo números enteros o decimales)
  export const validateQuantity = (quantity) => {
    const quantityRegex = /^\d+(\.\d+)?$/; // Acepta números enteros o decimales
    if (!quantityRegex.test(quantity)) {
      return "La cantidad debe ser un número válido (entero o decimal)";
    }
    return null;
};
