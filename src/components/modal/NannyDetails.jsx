import { useState } from "react";
import { deleteDocumentFirebase } from "../../services/data-firebase";
import SvgDelet from "../svg/SvgDelet";

import imgLogoNiñeraYa from "../../assets/logo-niñeras-ya.JPG";

const NannyDetails = ({ convertTimestampToDate, selectedNanny, onDeleteNanny }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Función para manejar la eliminación
  const handleDelete = () => {
    setShowConfirmation(true); // Mostrar el modal de confirmación
  };

  // Función para confirmar la eliminación
  const confirmDelete = () => {
  deleteDocumentFirebase('nana',selectedNanny.idFirestore)
    onDeleteNanny(selectedNanny.idFirestore); // Llama a la función de eliminación
    setShowConfirmation(false); // Cierra el modal
  };

  // Función para cancelar la eliminación
  const cancelDelete = () => {
    setShowConfirmation(false); // Cierra el modal
  };

  return (
    <div>
      {/* Detalles de la niñera */}
      <div>
        <img src={selectedNanny.urlAvatar || imgLogoNiñeraYa } alt="Niñeras ya" className="w-auto h-24 rounded-sm" />
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Creado
        </label>
        <p className="text-sm font-semibold text-gray-700">
          {selectedNanny?.createdAt
            ? convertTimestampToDate(
                selectedNanny.createdAt.seconds,
                selectedNanny.createdAt.nanoseconds
              ).toLocaleString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "Fecha no disponible"}
        </p>
      </div>

      {/* Botón de eliminar con ícono SVG */}
      <div className="mt-4">
        <button
          onClick={handleDelete}
          className="p-2 bg-red-200 text-white rounded-md hover:bg-red-300 transition duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          {/* Ícono de basurero SVG */}
         <SvgDelet/>
        </button>
      </div>

      {/* Modal de confirmación */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              ¿Estás seguro de eliminar esta niñera?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NannyDetails;