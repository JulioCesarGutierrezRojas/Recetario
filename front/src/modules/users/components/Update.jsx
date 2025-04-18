import { useState, useEffect } from 'react';
import { UserController } from '../adapters/controller';
import {showSuccessToast, showErrorToast, showConfirmation} from '../../../kernel/alerts';

export const Update = ({ initialData, onSuccess }) => {
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
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    showConfirmation(
      '¿Estás segura/o?',
      '¿Deseas actualizar este usuario?',
      'warning',
      handleUpdate
    );
  };

  return (
    <form onSubmit={handleSubmit}>
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
