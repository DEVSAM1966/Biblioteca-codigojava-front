import React, { useState } from "react";
import { X } from "lucide-react";
import { usersService } from "../../services/users.service";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const CreateUserModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [fullname, setFullname] = useState("");
  const [dni, setDni] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await usersService.create({
        fullname,
        dni,
        address,
        city,
        province,
        postalCode,
        country,
        phone,
        email,
        password,
        role,
      });

      setSuccess("Usuario creado correctamente.");
      onCreated();

      setTimeout(() => {
        onClose();
      }, 700);

    } catch {
      setError("Error al crear el usuario.");
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

        <h2 className="text-xl font-semibold mb-4">Crear nuevo usuario</h2>

        <div className="flex flex-col gap-3">

          <input
            type="text"
            placeholder="Nombre completo"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Dirección"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Ciudad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Provincia"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Código postal"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="País"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPPORT">SUPPORT</option>
          </select>

        </div>

        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-3">{success}</p>}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateUserModal;
