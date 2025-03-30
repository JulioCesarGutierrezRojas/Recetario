import { useState, useEffect } from 'react';
/*import { UserController } from '../adapters/controller';**/

export const Register = ({ initialData, onSuccess, isEditing = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    sex: '',
    start: '', 
    type: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await UserController.updateUser(formData.id, formData);
      } else {
        await UserController.createUser(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving user:', error);
    }
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

      {!formData.id && (
        <div className="mb-3">
          <label className="form-label">Contraseña:</label>
          <input
            type="password"
            className="form-control"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required disabled
          />
        </div>
      )}

<div className="mb-3">
        <label>Sexo</label>
        <select
          className="form-control"
          value={formData.sex}
          onChange={(e) => setFormData({...formData, sex: e.target.value})}
          disabled></select>
      </div>

      <div className="mb-3">
        <label>Fecha de Registro</label>
        <input
          type="date"
          className="form-control"
          value={formData.start.split('T')[0]}
          disabled
        />
      </div>

      <div className="mb-3">
        <label>Tipo de Usuario</label>
        <select
          className="form-control"
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          disabled
        >
          <option value="admin">Administrador</option>
          <option value="usuario">Usuario</option>
        </select>
      </div>

      <div className="d-grid gap-2">
        <button type="submit" className="btn btn-blue">
          {formData.id ? 'Actualizar Usuario' : 'Registrar Usuario'}
        </button>
      </div>
    </form>
  );
};