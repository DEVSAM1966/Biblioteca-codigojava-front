import React, { useState } from "react";
import { Loan } from "../../services/loans.service";
import { X } from "lucide-react";

interface Props {
  loan: Loan;
  onClose: () => void;
  onUpdate: (id: number, returnDate: string | null) => void;
}

const LoanEditModal: React.FC<Props> = ({ loan, onClose, onUpdate }) => {
  // El input type="date" SIEMPRE debe recibir aaaa-mm-dd
  const [returnDate, setReturnDate] = useState(
    loan.returnDate ? loan.returnDate : ""
  );

  const handleSubmit = () => {
    // Validación: returnDate no puede ser menor que loanDate
    if (returnDate && returnDate < loan.loanDate) {
      alert("La fecha de devolución no puede ser anterior a la fecha de préstamo.");
      return;
    }

    onUpdate(loan.loanId, returnDate || null);
  };

  const isReturned = loan.returnDate
    ? new Date(loan.returnDate) <= new Date()
    : false;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">

        {/* Botón cerrar */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Editar Préstamo</h2>

        <div className="space-y-3 text-sm">

          <p><strong>ID:</strong> {loan.loanId}</p>
          <p><strong>Usuario:</strong> {loan.userId}</p>
          <p><strong>ISBN:</strong> {loan.isbn}</p>
          <p><strong>Fecha préstamo:</strong> {loan.loanDate}</p>

          {/* Campo editable */}
          <div>
            <label className="font-medium">Fecha devolución:</label>
            <input
              type="date"
              value={returnDate}
              min={loan.loanDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="mt-1 w-full border px-3 py-2 rounded-lg"
            />
          </div>

          <p>
            <strong>Estado:</strong>{" "}
            {isReturned ? (
              <span className="text-green-600 font-semibold">Devuelto</span>
            ) : (
              <span className="text-red-600 font-semibold">Pendiente</span>
            )}
          </p>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoanEditModal;
