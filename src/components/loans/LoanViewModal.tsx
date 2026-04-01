import React from "react";
import { Loan } from "../../services/loans.service";
import { X } from "lucide-react";

interface Props {
  loan: Loan;
  onClose: () => void;
}


const LoanViewModal: React.FC<Props> = ({ loan, onClose }) => {
  const isReturned = loan.returnDate
    ? new Date(loan.returnDate) <= new Date()
    : false;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">

        {/* Cerrar */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Detalles del Préstamo</h2>

        <div className="space-y-2 text-sm">
          {/* Mostrar toda la info del préstamo */}

          <p><strong>ID:</strong> {loan.loanId}</p>
          <p><strong>Usuario:</strong> {loan.userId}</p>
          <p><strong>ISBN:</strong> {loan.isbn}</p>
          <p><strong>Fecha de préstamo:</strong> {loan.loanDate}</p>
          <p><strong>Fecha de devolución:</strong> {loan.returnDate ?? "—"}</p>

          <p>
            <strong>Estado:</strong>{" "}
            
            {isReturned ? (
              <span className="text-green-600 font-semibold">Devuelto</span>
            ) : (
              <span className="text-red-600 font-semibold">Pendiente</span>
        )}

          </p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoanViewModal;
