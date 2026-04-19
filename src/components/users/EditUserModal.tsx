import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { usersService, User } from "../../services/users.service";
import { getCurrentUser } from "../../utils/auth.storage";

interface Props {
  userId: number;
  onClose: () => void;
  onUpdated: () => void;
}

const EditUserModal: React.FC<Props> = ({ userId, onClose, onUpdated }) => {
  const [userData, setUserData] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔵 NUEVO — Usuario autenticado
  const currentUser = getCurrentUser();
  const isSupport = currentUser?.role === "SUPPORT";
  const isEditingSelf = currentUser?.userId === userId;

  // Estados editables
  const [fullname, setFullname] = useState("");
  const [dni, setDni] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("USER");

  // 1) Cargar datos completos del usuario
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await usersService.getById(userId);
        setUserData(data);

        // Inicializar campos editables
        setFullname(data.fullname || "");
        setDni(data.dni || "");
        setAddress(data.address || "");
        setCity(data.city || "");
        setProvince(data.province || "");
        setPostalCode(data.postalCode || "");
        setCountry(data.country || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setRole(data.role || "USER");

      } catch {
        setError("Error cargando datos del usuario.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  // 2) Mientras carga, mostrar spinner
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
          Cargando datos del usuario...
        </div>
      </div>
    );
  }

  if (!userData) return null;

  // 4) Guardar cambios
  const handleUpdate = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await usersService.update(userId, {
        fullname,
        dni,
        address,
        city,
        province,
        postalCode,
        country,
        phone,
        email,
        role,
      });

      setSuccess("Usuario actualizado correctamente.");
      onUpdated();

      setTimeout(() => onClose(), 700);

    } catch {
      setError("Error al actualizar el usuario.");
    } finally {
      setSaving(false);
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

        <h2 className="text-xl font-semibold mb-4">Editar usuario</h2>

        <div className="flex flex-col gap-3">

          <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} className="border px-3 py-2 rounded" placeholder="Nombre completo" />

          <input type="text" value={dni} onChange={(e) => setDni(e.target.value)} className="border px-3 py-2 rounded" placeholder="DNI" />

          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="border px-3 py-2 rounded" placeholder="Dirección" />

          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="border px-3 py-2 rounded" placeholder="Ciudad" />

          <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} className="border px-3 py-2 rounded" placeholder="Provincia" />

          <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="border px-3 py-2 rounded" placeholder="Código postal" />

          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="border px-3 py-2 rounded" placeholder="País" />

          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="border px-3 py-2 rounded" placeholder="Teléfono" />

          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border px-3 py-2 rounded" placeholder="Correo electrónico" />

          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            className="border px-3 py-2 rounded"
            disabled={
              (isSupport && isEditingSelf) ||
              (isSupport && userData.role === "ADMIN")
            }
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPPORT">SUPPORT</option>
          </select>

        </div>

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-3">{success}</p>}

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
          <button onClick={handleUpdate} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditUserModal;


