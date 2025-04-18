import { useState, useEffect } from 'react';
/*import { UserController } from '../adapters/controller';*/
import Modal from '../components/Modal';
import DataTable from "react-data-table-component";
import { Trash, Edit, Trash2 } from 'react-feather';
import {showAlert, showConfirmation} from '../../../kernel/alerts';



export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    const fakeUsers = [
      {
        id: 1,
        name: 'Ana Torres',
        email: 'ana.torres@example.com',
        sex: 'Femenino',
        start: '2023-01-10',
        type: 'Administrador',
      },
      {
        id: 2,
        name: 'Carlos Gómez',
        email: 'carlos.gomez@example.com',
        sex: 'Masculino',
        start: '2022-11-05',
        type: 'Empleado',
      },
      {
        id: 3,
        name: 'Laura Méndez',
        email: 'laura.mendez@example.com',
        sex: 'Femenino',
        start: '2021-08-20',
        type: 'Usuario',
      },
      {
        id: 4,
        name: 'Pedro Castillo',
        email: 'pedro.castillo@example.com',
        sex: 'Masculino',
        start: '2020-02-14',
        type: 'Empleado',
      },
      {
        id: 5,
        name: 'María Fernanda',
        email: 'maria.fernanda@example.com',
        sex: 'Femenino',
        start: '2019-07-30',
        type: 'Administrador',
      },
      {
        id: 6,
        name: 'Jorge Martínez',
        email: 'jorge.martinez@example.com',
        sex: 'Masculino',
        start: '2023-03-01',
        type: 'Usuario',
      },
      {
        id: 7,
        name: 'Sofía Reyes',
        email: 'sofia.reyes@example.com',
        sex: 'Femenino',
        start: '2022-10-12',
        type: 'Empleado',
      },
      {
        id: 8,
        name: 'Luis Ortega',
        email: 'luis.ortega@example.com',
        sex: 'Masculino',
        start: '2021-06-25',
        type: 'Administrador',
      },
      {
        id: 9,
        name: 'Claudia López',
        email: 'claudia.lopez@example.com',
        sex: 'Femenino',
        start: '2020-09-17',
        type: 'Usuario',
      },
      {
        id: 10,
        name: 'Fernando Ruiz',
        email: 'fernando.ruiz@example.com',
        sex: 'Masculino',
        start: '2018-12-05',
        type: 'Empleado',
      },
      {
        id: 11,
        name: 'chiwis ',
        email: 'chiwis@example.com',
        sex: 'Masculino',
        start: '2018-12-05',
        type: 'Empleado',
      },
    ];
    setUsers(fakeUsers);
  };
  
  /*const fetchUsers = async () => {
    try {
      const data = await UserController.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };*/

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete =  (id) => {/* poner el async await una vez que se conecte ok*/
     showConfirmation('Eliminacion de usuario', '¿Seguro que quieres eliminar este usuario?', 'warning' , onDelete)
  };
  const onDelete =  (id) => {
    /*en esta se va a cambiar cuando este el back, try se manda el spinner... catch imprimir alerta de error y finally terminar el spinner*/
     showAlert('Eliminado', 'Usuario eliminado correctamente', 'success');
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
      selector: (row) => new Date(row.start).toLocaleDateString(),
      sortable: true,
    },
    {
      name: <span className="fw-bold text-primary fs-5">Tipo</span>,
      selector: (row) => row.type,
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
        >
          <i className="bi bi-plus-circle me-2"></i>Nuevo Usuario
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