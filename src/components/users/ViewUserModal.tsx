import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { usersService, User } from "../../services/users.service";

interface Props {
  userId: number;
  onClose: () => void;
}

const ViewUserModal: React.FC<Props> = ({ userId, onClose }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await usersService.getById(userId);
        setUser(data);
        setError("");
      } catch {
        setError("Error cargando usuario");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          Cargando usuario...
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <p className="text-red-600">{error || "Usuario no encontrado"}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Detalles del usuario</h2>

        <div className="space-y-3 text-sm">

          <div>
            <span className="font-semibold">ID:</span> {user.userId}
          </div>

          <div>
            <span className="font-semibold">Nombre completo:</span> {user.fullname}
          </div>

          <div>
            <span className="font-semibold">DNI:</span> {user.dni}
          </div>

          <div>
            <span className="font-semibold">Dirección:</span> {user.address}
          </div>

          <div>
            <span className="font-semibold">Ciudad:</span> {user.city}
          </div>

          <div>
            <span className="font-semibold">Provincia:</span> {user.province}
          </div>

          <div>
            <span className="font-semibold">Código postal:</span> {user.postalCode}
          </div>

          <div>
            <span className="font-semibold">País:</span> {user.country}
          </div>

          <div>
            <span className="font-semibold">Teléfono:</span> {user.phone}
          </div>

          <div>
            <span className="font-semibold">C. electrónico:</span> {user.email}
          </div>

          <div>
            <span className="font-semibold">F. Alta:</span>{" "}
            {user.registrationDate
              ? user.registrationDate.slice(0, 10)
              : "—"}
          </div>

          <div>
            <span className="font-semibold">Borrado lógico:</span> {user.userDrop ? "Sí" : "No"}
          </div>

          <div>
            <span className="font-semibold">Dias castigo:</span> {user.daysDisciplinary}
          </div>

          <div>
            <span className="font-semibold">Rol:</span> {user.role}
          </div>

          

        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

export default ViewUserModal;

