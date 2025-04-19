
export const validateEmail = (email) => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    return emailRegex.test(email) && !email.includes(' ');
};

export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{8,}$/;
    return passwordRegex.test(password);
};

export const validateNewPassword = (formData) => {
    const errors = {};
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{8,}$/;
    
    if (!formData.password || !formData.password.trim()) {
        errors.password = "La contraseña no puede estar vacía";
    } else if (!passwordRegex.test(formData.password)) {
        errors.password = "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial";
    }

    if (!formData.passwordConfirm || !formData.passwordConfirm.trim()) {
        errors.passwordConfirm = "Debes confirmar tu contraseña";
    } else if (formData.password !== formData.passwordConfirm) {
        errors.passwordConfirm = "Las contraseñas no coinciden";
    }

    return errors;
};

export const validateRegisterForm = (formData) => {
    const errors = {};
    const repeatedCharRegex = /(.)\1{3,}/;

    if (!formData.name.trim()) {
        errors.name = "El nombre no puede estar vacío";
    } else if (/^\d+$/.test(formData.name.trim())) {
        errors.name = "El nombre no puede contener solo números";
    } else if (repeatedCharRegex.test(formData.name.trim())) {
        errors.name = "El nombre no puede contener letras repetidas excesivamente";
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


export const validateNonEmpty = (value, fieldName) => {
    if (!value.trim()) {
        return `${fieldName} no puede estar vacío o contener solo espacios`;
    }
    return null;
};


export const validateImage = (file) => {
    if (file && !file.type.startsWith('image/')) {
        return "El archivo debe ser una imagen";
    }
    return null;
};


export const validateQuantity = (quantity) => {
    const quantityRegex = /^\d+(\.\d+)?$/;
    if (!quantityRegex.test(quantity)) {
        return "La cantidad debe ser un número válido (entero o decimal)";
    }
    return null;
};

export const validateRegisterFormForAdmin = (formData) => {
    const errors = {};

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{8,}$/;
    const repeatedCharRegex = /(.)\1{3,}/;

    if (!formData.name.trim()) {
        errors.name = "El nombre no puede estar vacío";
    } else if (/^\d+$/.test(formData.name.trim())) {
        errors.name = "El nombre no puede contener solo números";
    } else if (repeatedCharRegex.test(formData.name.trim())) {
        errors.name = "El nombre no puede contener letras repetidas excesivamente";
    }

    if (!formData.email || !formData.email.trim()) {
        errors.email = "El correo no puede estar vacío";
    } else if (!emailRegex.test(formData.email) || formData.email.includes(' ')) {
        errors.email = "Correo no válido";
    }

    if (!formData.sex || !formData.sex.trim()) {
        errors.sex = "Selecciona un género";
    }

    if (!formData.role || !formData.role.trim()) {
        errors.role = "El rol es obligatorio";
    }

    if (!formData.password || !formData.password.trim()) {
        errors.password = "La contraseña no puede estar vacía";
    } else if (!passwordRegex.test(formData.password)) {
        errors.password = "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial";
    }

    if (!formData.passwordConfirm || !formData.passwordConfirm.trim()) {
        errors.passwordConfirm = "Debes confirmar tu contraseña";
    } else if (formData.password !== formData.passwordConfirm) {
        errors.passwordConfirm = "Las contraseñas no coinciden";
    }

    return errors;
};


export const validateUpdateUserForm = (formData) => {
    const errors = {};
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    const repeatedCharRegex = /(.)\1{3,}/;

    if (!formData.name.trim()) {
        errors.name = "El nombre no puede estar vacío";
    } else if (/^\d+$/.test(formData.name.trim())) {
        errors.name = "El nombre no puede contener solo números";
    } else if (repeatedCharRegex.test(formData.name.trim())) {
        errors.name = "El nombre no puede contener letras repetidas excesivamente";
    }

    if (!formData.email || !formData.email.trim()) {
        errors.email = "El correo no puede estar vacío";
    } else if (!emailRegex.test(formData.email) || formData.email.includes(' ')) {
        errors.email = "Correo no válido";
    }

    if (!formData.sex.trim()) {
        errors.sex = "Selecciona un género";
    }

    return errors;
};
