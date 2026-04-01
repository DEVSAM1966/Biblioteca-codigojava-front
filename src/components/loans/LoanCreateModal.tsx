import React, { useState } from "react";
import { LoanCreateDto } from "../../services/loans.service";

interface Props {
  onClose: () => void;
  onCreate: (data: LoanCreateDto) => void;
}

const LoanCreateModal: React.FC<Props> = ({ onClose, onCreate }) => {
  const [userId, setUserId] = useState<number>(0);
  const [isbn, setIsbn] = useState<string>("");
  const [loanDate, setLoanDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!userId || !isbn || !loanDate) {
      alert("Todos los campos obligatorios deben estar completos.");
      return;
    }

    onCreate({
      userId,
      isbn,
      loanDate,
      returnDate,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Agregar Préstamo</h2>

        <div className="flex flex-col gap-3">

          <div>
            <label className="block text-sm font-medium">User ID</label>
            <input
              type="number"
              className="w-full border px-3 py-2 rounded"
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">ISBN</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Fecha Préstamo</label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded"
              value={loanDate}
              onChange={(e) => setLoanDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Fecha Devolución (opcional)</label>
            <input
              type="date"
              className="w-full border px-3 py-2 rounded"
              value={returnDate ?? ""}
              onChange={(e) =>
                setReturnDate(e.target.value === "" ? null : e.target.value)
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanCreateModal;
