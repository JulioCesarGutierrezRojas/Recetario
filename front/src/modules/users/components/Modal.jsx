import { Register } from "../components/Register";


const Modal = ({ showModal, setShowModal, selectedUser, fetchUsers }) => {
  return (
    <div
      className={`modal ${showModal ? "show d-block" : "d-none"}`}
      tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {selectedUser ? "Editar Usuario" : "Nuevo Usuario"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <Register
              initialData={selectedUser}
              onSuccess={() => {
                setShowModal(false);
                fetchUsers();
              }}
              isEditing={!!selectedUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
