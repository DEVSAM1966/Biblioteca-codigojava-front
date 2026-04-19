import React, { useState } from "react";
import { X } from "lucide-react";
import { usersService, User } from "../../services/users.service";

interface Props {
  user: User;
  onClose: () => void;
  onDeleted: () => void;
}

const DeleteUserModal: React.FC<Props> = ({ user, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await usersService.delete(user.userId);

      setSuccess("Usuario eliminado permanentemente.");
      onDeleted(); // recargar tabla

      setTimeout(() => {
        onClose();
      }, 700);

    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("El usuario no existe.");
      } else {
        setError("Error al eliminar el usuario.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Eliminar usuario</h2>

        <p className="text-sm mb-4">
          ¿Seguro que deseas eliminar a <strong>{user.fullname}</strong>?  
          Esta acción es <strong>permanente</strong> y no se puede deshacer.
        </p>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Procesando..." : "Eliminar"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DeleteUserModal;
