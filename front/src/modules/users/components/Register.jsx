import { useState } from "react";
import { UserController } from "../adapters/controller";
import {
  showAlertWithoutCancel,
  showConfirmation,
  showSuccessToast,} from "../../../kernel/alerts";
import Loader from "../../../components/Loader";

export const Register = ({ onSuccess }) => {
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    sex: "",
    password: "",
    passwordConfirm: "",
    role: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      sex: "",
      password: "",
      passwordConfirm: "",
      role: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      showAlertWithoutCancel(
        "Contraseñas no coinciden",
        "Por favor verifica que ambas contraseñas sean iguales",
        "error"
      );
      return;
    }
    showConfirmation(
      "¿Está seguro de registrar este usuario?",
      "Esta acción agregará el usuario al sistema",
      "warning",
      () => onSubmit(e)
    );
  };

  const onSubmit = async (e) => {
    setLoading(true);
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        sex: formData.sex,
        role: formData.role,
      };

      await UserController.createUser(payload);

      showSuccessToast({
        title: "Usuario Agregado",
        text: "El usuario ha sido agregado correctamente",
      });
      console.log("SUCCESS");
      onSuccess();
      resetForm();
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      showAlertWithoutCancel(
        "Error al registrar",
        "Hubo un problema al agregar el usuario",
        "error"
      );
      resetForm();
    }finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Loader isLoading={loading} />
      <div className="mb-3">
        <label className="form-label">Nombre:</label>
        <input
          type="text"
          className="form-control"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email:</label>
        <input
          type="email"
          className="form-control"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <label>Sexo</label>
        <select
          className="form-control"
          value={formData.sex}
          onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
          required
        >
          <option value="">Selecciona tu género</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div className="mb-3">
        <label>Tipo de Usuario</label>
        <select
          className="form-control"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
        >
          <option value="">Selecciona</option>
          <option value="Administrador">Administrador</option>
          <option value="Usuario">Usuario</option>
        </select>
      </div>

      <div className="mb-3">
        <label>Contraseña</label>
        <input
          type="password"
          className="form-control"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
      </div>

      <div className="mb-3">
        <label>Confirmar Contraseña</label>
        <input
          type="password"
          className="form-control"
          value={formData.passwordConfirm}
          onChange={(e) =>
            setFormData({ ...formData, passwordConfirm: e.target.value })
          }
          required
        />
      </div>

      <button type="submit" className="btn btn-secondary w-100">
        Registrar Usuario
      </button>
    </form>
  );
};
