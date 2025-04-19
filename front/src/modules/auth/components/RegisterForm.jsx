import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import styles from '../../../styles/form-login.module.css';
import Loader from "../../../components/Loader.jsx";
import {showSuccessToast, showWarningToast} from "../../../kernel/alerts.js";
import {registerUser} from "../controller/controller.js";
import { validateRegisterForm } from "../../../kernel/validations.js";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanedData = {
            ...formData,
            name: formData.name.trim(),
            email: formData.email.trim(),
            gender: formData.gender.trim(),
            password: formData.password.trim(),
            confirmPassword: formData.confirmPassword.trim()
        };
    
        const validationErrors = validateRegisterForm(cleanedData);
        if (Object.keys(validationErrors).length > 0) {
            const firstError = Object.values(validationErrors)[0];
            showWarningToast({ title: 'Error', text: firstError });
            return;
        }
    
        setIsLoading(true);
        try {
            const response = await registerUser(
                cleanedData.name,
                cleanedData.email,
                cleanedData.gender,
                cleanedData.password
            );
    
            showSuccessToast({ title: 'Éxito', text: response });
            
            navigate('/');
        } catch (e) {
            showWarningToast({ title: 'Error', text: e.message });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    return (
        <div className={styles.container}>
            <Loader isLoading={isLoading} />
            <div className={styles.rightPanel}>
                <div className={styles.scrollContainer}>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <h2 className={styles.title}>Registro de Usuario</h2>
                        <p className={styles.subtitle}>Empieza a disfrutar de nuestras funcionalidades</p>

                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.label}>Nombre completo</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="Ej: Ana García"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>Correo electrónico</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={styles.input}
                                placeholder="ana@ejemplo.com"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="gender" className={styles.label}>Género</label>
                            <select
                                id="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className={`${styles.input} ${styles.select}`}
                                required
                            >
                                <option value="">Selecciona tu género</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.label}>Contraseña</label>
                            <div className={styles.passwordInputGroup}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Mínimo 8 caracteres"
                                    minLength="8"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className={styles.passwordToggle}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>Confirmar Contraseña</label>
                            <div className={styles.passwordInputGroup}>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="Repite tu contraseña"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className={styles.passwordToggle}
                                >
                                    {showConfirmPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                            <line x1="1" y1="1" x2="23" y2="23"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            Crear Cuenta
                        </button>

                        <div className={styles.linksContainer}>
                            <p className={styles.signupText}>
                                ¿Ya tienes cuenta?{' '}
                                <Link to="/" className={styles.link}>
                                    Ingresa aquí
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;