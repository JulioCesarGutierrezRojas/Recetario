import { useState, useEffect } from 'react';
/*import { UserController } from '../adapters/controller';*/
import Modal from '../components/Modal';
import { Pagination } from '../components/Pagination';



export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; 

  const fetchUsers = async () => {
    try {
      const data = await UserController.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
      try {
        await UserController.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Lista de Usuarios</h1>
        <button 
          className="btn btn-blue text-dark"
          onClick={() => {
            setSelectedUser(null);
            setShowModal(true);
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>Nuevo Usuario
        </button>
      </div>

      <table className="table table-striped table-hover">
      <thead className="table-blue"> 
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Sexo</th>
            <th>Inicio</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.sex}</td>
              <td>{new Date(user.start).toLocaleDateString()}</td>
              <td>{user.type}</td>
              <td>
                <button 
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowModal(true);
                  }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(user.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* paginación */}
      <Pagination 
        usersPerPage={usersPerPage} 
        totalUsers={users.length} 
        paginate={paginate} 
        currentPage={currentPage} 
      />

      {/* Modal */}
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