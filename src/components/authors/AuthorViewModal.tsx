import React from "react";
import { X } from "lucide-react";

interface Props {
  author: { authorId: number; nameAuthor: string } | null;
  onClose: () => void;
}

const AuthorViewModal: React.FC<Props> = ({ author, onClose }) => {
  if (!author) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Información del autor
        </h2>

        <div className="space-y-2">
          <p>
            <span className="font-semibold text-gray-700">ID:</span>{" "}
            {author.authorId}
          </p>
          <p>
            <span className="font-semibold text-gray-700">Nombre:</span>{" "}
            {author.nameAuthor}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthorViewModal;
