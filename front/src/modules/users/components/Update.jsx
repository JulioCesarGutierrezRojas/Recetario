import { useState, useEffect } from 'react';
import { UserController } from '../adapters/controller';
import {showSuccessToast, showErrorToast, showConfirmation} from '../../../kernel/alerts';
import Loader from '../../../components/Loader';
import { validateUpdateUserForm } from '../../../kernel/validations';

export const Update = ({ initialData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    sex: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { id, name, email, sex } = formData;
      const payload = { name, email, sex };

      await UserController.updateUser(id, payload);

      showSuccessToast({
        title: 'Usuario actualizado correctamente'
      });

      onSuccess();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Ocurrió un error al actualizar';
      showErrorToast({
        title: 'Error',
        text: errorMsg
      });
    }finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateUpdateUserForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.values(validationErrors)[0];
      showErrorToast({
        title: 'Error de validación',
        text: firstError
      });
      return;
    }

    showConfirmation(
      '¿Estás segura/o?',
      '¿Deseas actualizar este usuario?',
      'warning',
      handleUpdate
    );
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

      <button type="submit" className="btn btn-success w-100">
        Actualizar Usuario
      </button>
    </form>
  );
};
