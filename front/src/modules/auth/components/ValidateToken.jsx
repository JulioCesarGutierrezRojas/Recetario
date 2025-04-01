import React from 'react';
import styles from '../../../styles/form-login.module.css';

const ValidateToken = ({ email, token, setToken, setStep }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para validar el token
        setStep(3);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3 text-center">
                <p className="text-muted">
                    Hemos enviado un código de 5 dígitos a <span className="fw-bold" style={{color: 'var(--tomato)'}}>{email}</span>
                </p>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="token" className={styles.label}>Código de verificación</label>
                <input
                    type="text"
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className={`${styles.input} text-center fw-bold`}
                    placeholder="_____"
                    maxLength="5"
                    required
                    style={{letterSpacing: '5px', fontSize: '1.2rem'}}
                />
            </div>

            <button type="submit" className={styles.submitButton}>
                Verificar código
            </button>

            <div className="text-center mt-3">
                <button
                    type="button"
                    className="btn btn-link p-0"
                    style={{color: 'var(--tomato)', fontSize: '0.9rem'}}
                >
                    <i className="bi bi-arrow-repeat me-2"></i>Reenviar código
                </button>
            </div>
        </form>
    );
};

export default ValidateToken;