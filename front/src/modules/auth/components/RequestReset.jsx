import React, {useState} from 'react';
import styles from '../../../styles/form-login.module.css';
import {showSuccessToast, showWarningToast} from "../../../kernel/alerts.js";
import {sendEmail} from "../controller/controller.js";
import Loader from "../../../components/Loader.jsx";

const RequestReset = ({ email, setEmail, setStep }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await sendEmail(email);
            showSuccessToast({ title: 'Exito', text: response })
            setStep(2);
        } catch (e) {
            showWarningToast({ title: 'Error', text: e.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Loader isLoading={isLoading}/>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Correo electrónico</label>
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

                <button type="submit" className={styles.submitButton}>
                    Enviar código de verificación
                </button>
            </form>
        </>

    );
};

export default RequestReset;