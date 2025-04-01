import React, { useState } from 'react';
import { Link } from 'react-router';
import RequestReset from '../components/RequestReset';
import ValidateToken from '../components/ValidateToken';
import ChangePassword from '../components/ChangePassword';
import styles from '../../../styles/form-login.module.css';

const PasswordResetScreen = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');

    return (
        <div className={styles.container} style={{backgroundColor: 'var(--white)'}}>
            <div className={styles.leftPanel} style={{
                background: 'linear-gradient(135deg, var(--primary), var(--tomato))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{textAlign: 'center', color: 'var(--white)'}}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '1rem',
                        color: 'var(--secondary)'
                    }}>Recetario</h1>
                    <p style={{fontSize: '1.2rem'}}>Tu libro de recetas digital</p>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.form} style={{maxWidth: '450px'}}>
                    <h2 className={styles.title}>Restablecer Contraseña</h2>
                    <p className={styles.subtitle}>
                        {step === 1 && 'Ingresa tu correo para comenzar'}
                        {step === 2 && 'Verifica tu identidad'}
                        {step === 3 && 'Crea una nueva contraseña'}
                    </p>

                    {/* Indicador de pasos minimalista */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '2rem',
                        gap: '0.5rem'
                    }}>
                        {[1, 2, 3].map((stepNumber) => (
                            <React.Fragment key={stepNumber}>
                                <div style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    backgroundColor: step >= stepNumber ? 'var(--tomato)' : 'var(--blue)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.9rem',
                                    fontWeight: '600'
                                }}>
                                    {stepNumber}
                                </div>
                                {stepNumber < 3 && (
                                    <div style={{
                                        width: '30px',
                                        height: '2px',
                                        backgroundColor: step > stepNumber ? 'var(--tomato)' : 'var(--blue)'
                                    }}></div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {step === 1 && <RequestReset email={email} setEmail={setEmail} setStep={setStep} />}
                    {step === 2 && <ValidateToken email={email} token={token} setToken={setToken} setStep={setStep} />}
                    {step === 3 && <ChangePassword email={email} token={token} setStep={setStep} />}

                    <div style={{
                        marginTop: '1.5rem',
                        textAlign: 'center',
                        borderTop: '1px solid #eee',
                        paddingTop: '1.5rem'
                    }}>
                        <Link to="/" style={{
                            color: 'var(--tomato)',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}>
                            <i className="bi bi-arrow-left" style={{marginRight: '0.5rem'}}></i>
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetScreen;