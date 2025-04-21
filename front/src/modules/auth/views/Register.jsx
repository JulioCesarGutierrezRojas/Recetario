import React from "react";
import RegisterForm from "../components/RegisterForm.jsx";
import logo from "../../../assets/recetario-signup.jpg";
import styles from "../../../styles/form-login.module.css";

const Register = () => {
    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <div className={styles.logoContainer}>
                    <div className={styles.logoWrapper}>
                        <img src={logo} className={styles.logo} alt="Logo Sabor & Punto" />
                    </div>
                    <h1 className={styles.appName}>Sabor & Punto</h1>
                    <p style={{fontSize: '1.2rem'}}>Únete a nuestra comunidad culinaria</p>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <RegisterForm/>
            </div>
        </div>
    )
}

export default Register
