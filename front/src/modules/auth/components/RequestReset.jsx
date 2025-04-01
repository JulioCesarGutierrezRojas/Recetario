import React, {useState} from 'react';
import styles from '../../../styles/form-login.module.css';
import {showAlert} from "../../../kernel/alerts.js";
import {sendEmail} from "../controller/controller.js";
import Loader from "../../../components/Loader.jsx";

const RequestReset = ({ email, setEmail, setStep }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await sendEmail(email);
            showAlert("Éxito", response, "success");
        } catch (e) {
            showAlert('Error', e.message, 'error');
        } finally {
            setIsLoading(false);
        }

        setStep(2);
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