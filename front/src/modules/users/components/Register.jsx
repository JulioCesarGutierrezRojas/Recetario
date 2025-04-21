import { useState } from "react";
import { UserController } from "../adapters/controller";
import {
  showAlertWithoutCancel,
  showConfirmation,
  showSuccessToast,
  showErrorToast
} from "../../../kernel/alerts";
import Loader from "../../../components/Loader";
import { validateRegisterFormForAdmin } from "../../../kernel/validations";
import { Eye, EyeOff } from "lucide-react";

export const Register = ({ onSuccess }) => {

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
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

    const validationErrors = validateRegisterFormForAdmin(formData);
    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.values(validationErrors)[0];

      showErrorToast({
        title: 'Error de validación',
        text: firstError,
      });

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
    } finally {
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
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control pr-10"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
            style={{ paddingRight: "2.5rem" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              cursor: "pointer",
            }}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="mb-3">
        <label>Confirmar Contraseña</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPasswordConfirm ? "text" : "password"}
            className="form-control"
            value={formData.passwordConfirm}
            onChange={(e) =>
              setFormData({ ...formData, passwordConfirm: e.target.value })
            }
            required
            style={{ paddingRight: "2.5rem" }}
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              cursor: "pointer",
            }}
          >
            {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Registrar Usuario
      </button>
    </form>
  );
};
