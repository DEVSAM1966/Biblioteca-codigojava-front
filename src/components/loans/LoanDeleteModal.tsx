import React, { useState } from "react";
import { Loan } from "../../services/loans.service";
import { X } from "lucide-react";

interface Props {
  loan: Loan;
  onClose: () => void;
  onDelete: (id: number) => void;
}

const LoanDeleteModal: React.FC<Props> = ({ loan, onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Eliminar Préstamo</h2>

        <p className="mb-4">
          ¿Seguro que deseas eliminar el préstamo con ID{" "}
          <strong>{loan.loanId}</strong>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancelar
          </button>

          <button
            onClick={() => onDelete(loan.loanId)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanDeleteModal;