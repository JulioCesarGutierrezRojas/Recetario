import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router';
import styles from '../../../styles/form-login.module.css';
import logo from '../../../assets/logo-recetario.jpg';
import Loader from "../../../components/Loader.jsx";
import {showWarningToast} from "../../../kernel/alerts.js";
import {signIn} from "../controller/controller.js";
import { validateEmail, validatePassword } from "../../../kernel/validations.js";


const LoginForm = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (!emailError) {
            showWarningToast({
                title: 'Correo inválido',
                text: 'Por favor ingresa un correo válido sin espacios.'
            });
            setIsLoading(false);
            return;
        }

        if (!passwordError) {
            showWarningToast({
                title: 'Contraseña inválida',
                text: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número, un carácter especial y sin espacios.'
            });
            setIsLoading(false);
            return;
        }

        try {
            await signIn(email, password);

            const role = localStorage.getItem('role');
            role === 'Administrador' ? navigate('/home') : navigate('/home');
        } catch (e) {
            showWarningToast({ title: 'Error', text: e.message });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.container}>
            <Loader isLoading={isLoading} />
            <div className={styles.leftPanel}>
                <div className={styles.logoContainer}>
                    <div className={styles.logoWrapper}>
                        <img src={logo} className={styles.logo} alt="Logo Sabor & Punto" />
                    </div>
                    <h1 className={styles.appName}>Sabor & Punto</h1>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h2 className={styles.title}>Bienvenido a Sabor & Punto</h2>
                    <p className={styles.subtitle}>Ingresa a tu cuenta</p>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="tucorreo@ejemplo.com"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>Contraseña</label>
                        <div className={styles.passwordInputGroup}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                placeholder="Ingresa tu contraseña"
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

                    <button type="submit" className={styles.submitButton}>
                        Iniciar Sesión
                    </button>

                    <div className={styles.linksContainer}>
                        <Link to="/forgot-password" className={styles.link}>
                            ¿Olvidaste tu contraseña?
                        </Link>
                        <p className={styles.signupText}>
                            ¿No tienes cuenta?{' '}
                            <Link to="/signup" className={styles.link}>
                                Regístrate
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
