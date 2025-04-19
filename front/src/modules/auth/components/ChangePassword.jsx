import React, { useState } from 'react';
import styles from '../../../styles/form-login.module.css';
import {useNavigate} from "react-router";
import {showSuccessToast, showWarningToast} from "../../../kernel/alerts.js";
import {changePassword} from "../controller/controller.js";
import Loader from "../../../components/Loader.jsx";
import { validateNewPassword } from '../../../kernel/validations.js';

const ChangePassword = ({ email, token, setStep, user }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            password: newPassword,
            passwordConfirm: confirmPassword
        };
    
        const errors = validateNewPassword(formData);
    
        if (Object.keys(errors).length > 0) {
            const firstErrorKey = Object.keys(errors)[0];
            showWarningToast({ title: 'Error', text: errors[firstErrorKey] });
            return;
        }

        setIsLoading(true);
        try {
            const response = await changePassword(user, newPassword, confirmPassword);

            showSuccessToast({ title: 'Éxito', text: response.message });

            navigate('/')
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
        <>
            <Loader isLoading={isLoading} />
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="newPassword" className={styles.label}>Nueva contraseña</label>
                    <div className={styles.passwordInputGroup}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={styles.input}
                            placeholder="Ingresa tu nueva contraseña"
                            required
                            minLength="8"
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
                    <label htmlFor="confirmPassword" className={styles.label}>Confirmar contraseña</label>
                    <div className={styles.passwordInputGroup}>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.input}
                            placeholder="Confirma tu nueva contraseña"
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
                    Cambiar contraseña
                </button>
            </form>
        </>
    );
};

export default ChangePassword;