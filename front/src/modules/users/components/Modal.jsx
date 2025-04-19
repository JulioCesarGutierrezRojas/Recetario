import { Register } from "../components/Register";
import { Update } from "../components/Update";

const Modal = ({ showModal, setShowModal, selectedUser, fetchUsers }) => {
  return (
    <div className={`modal ${showModal ? "show d-block" : "d-none"}`} tabIndex="-1">
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
            {selectedUser ? (
              <Update
                initialData={selectedUser}
                onSuccess={() => {
                  setShowModal(false);
                  fetchUsers();
                }}
              />
            ) : (
              <Register
                onSuccess={() => {
                  setShowModal(false);
                  fetchUsers();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
