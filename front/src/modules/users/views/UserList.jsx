import { useState, useEffect } from 'react';
import { UserController } from '../adapters/controller';
import Modal from '../components/Modal';
import DataTable from "react-data-table-component";
import { Trash, Edit, Trash2 } from 'react-feather';
import {showWarningToast, showConfirmation, showSuccessToast} from '../../../kernel/alerts';



export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
    try {
      const data = await UserController.getUsers();
      console.log(data);
      setUsers(data.result);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    showConfirmation(
      'Eliminación de usuario',
      '¿Seguro que quieres eliminar este usuario?',
      'warning',
      () => onDelete(id)
    );
  };
  

  const onDelete = async(id) => {
    setLoading(true);
    try {
      await UserController.deleteUser(id);
      showSuccessToast({ title: 'Usuario eliminado', text: 'El usuario ha sido eliminado correctamente' });
    } catch (error) {
      showWarningToast({ title: 'Error', text: error.message });
    } finally {
      setLoading(false);
      fetchUsers();
    }
  }

  const columns = [
    {
      name: <span className="fw-bold text-primary fs-5">Nombre</span>,
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: <span className="fw-bold text-primary fs-5">Email</span>,
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: <span className="fw-bold text-primary fs-5">Sexo</span>,
      selector: (row) => row.sex,
      sortable: true,
    },
    {
      name: <span className="fw-bold text-primary fs-5">Inicio</span>,
      selector: (row) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
    },
    {
      name: <span className="fw-bold text-primary fs-5">Tipo</span>,
      selector: (row) => row.role,
      sortable: true,
    },
    {
        name: <span className="fw-bold text-primary fs-5">Acciones</span>,
        cell: (row) => (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1 px-3"
              title="Actualizar usuario"
              onClick={() => {
                setSelectedUser(row);
                setShowModal(true);
              }}
            >
              <Edit size={20} />
            </button>
            <button
              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 px-3"
              title="Eliminar usuario"
              onClick={() => handleDelete(row.id)}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,      
    },
  ];

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h1 className="display-5 text-success mt-5">Lista de Usuarios</h1>
        <button 
          className="btn btn-primary fw-bold shadow rounded-3"
          onClick={() => {
            setSelectedUser(null);
            setShowModal(true);
          }}
        ><i className="bi bi-plus-circle me-2"></i>Nuevo Usuario
        </button>
      </div>

      <div className="card shadow-sm p-4">
        <DataTable
          columns={columns}
          data={users}
          pagination
          highlightOnHover
          striped
          responsive
          noDataComponent={<span className="text-danger fs-5">No hay usuarios registrados</span>}
        />
      </div>

      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        selectedUser={selectedUser}
        fetchUsers={fetchUsers}
      />

      {showModal && (
        <div 
          className="modal-backdrop fade show" 
          onClick={() => setShowModal(false)}
        ></div>
      )}
    </div>
  );
};