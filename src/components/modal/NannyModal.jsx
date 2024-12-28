import React, { useState } from "react";
import Modal from "react-modal";
import { updateDocumentFirebase } from "../../services/data-firebase";

export default function NannyModal({ isOpen, onClose, nannies, reload }) {
  const [selectedNanny, setSelectedNanny] = useState(null);

  const handleNannyClick = (nanny) => {
    setSelectedNanny(nanny);
  };

  const handleSave = async () => {
    try {
      await updateDocumentFirebase("nana", selectedNanny.idFirestore, selectedNanny);
    } catch (error) {
      console.error(error, "Error");
    }
    setSelectedNanny(null);
    reload();
  };

  const handleCloseDetails = () => {
    setSelectedNanny(null);
  };

  const toggleState = () => {
    setSelectedNanny((prevNanny) => ({
      ...prevNanny,
      state: !prevNanny.state,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 overflow-hidden transform transition-transform"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="max-h-[80vh] overflow-y-auto">
        {!selectedNanny ? (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Lista de Niñeras
            </h2>
            <ul className="space-y-4">
              {nannies.map((nanny) => (
                <li
                  key={nanny.idFirestore}
                  className="p-4 bg-blue-50 rounded-lg shadow hover:shadow-md cursor-pointer hover:bg-blue-100 transition"
                  onClick={() => handleNannyClick(nanny)}
                >
                  <p className="text-lg font-medium text-gray-800">{nanny.name}</p>
                  <p className="text-sm text-gray-600">{nanny.address}</p>
                  <p className="text-sm text-gray-600">{nanny.neighborhood}</p>
                  <p
                    className={`text-sm font-semibold mt-2 ${
                      nanny.state ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {nanny.state ? "Disponible" : "No Disponible"}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-end">
              <button
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 tracking-tight">
              Detalles de la Niñera
            </h2>
            <div className="space-y-6 bg-white p-6 rounded-xl shadow-lg ring-1 ring-gray-200">
              {/* Nombre */}
              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={selectedNanny.name}
                  onChange={(e) =>
                    setSelectedNanny({ ...selectedNanny, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500"
                  placeholder="Introduce el nombre"
                />
              </div>

              {/* Dirección */}
              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={selectedNanny.address}
                  onChange={(e) =>
                    setSelectedNanny({ ...selectedNanny, address: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500"
                  placeholder="Introduce la dirección"
                />
              </div>

              {/* Barrio */}
              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Barrio
                </label>
                <input
                  type="text"
                  value={selectedNanny.neighborhood}
                  onChange={(e) =>
                    setSelectedNanny({
                      ...selectedNanny,
                      neighborhood: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500"
                  placeholder="Introduce el barrio"
                />
              </div>

              {/* Estado */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm ring-1 ring-gray-200">
                <p
                  className={`text-lg font-medium ${
                    selectedNanny.state ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {selectedNanny.state ? "Disponible" : "No Disponible"}
                </p>
                <button
                  onClick={toggleState}
                  className={`px-6 py-2 font-semibold text-white rounded-lg shadow-md transition-all transform duration-300 ${
                    selectedNanny.state
                      ? "bg-red-500 hover:bg-red-600 active:scale-95 focus:ring-4 focus:ring-red-300"
                      : "bg-green-500 hover:bg-green-600 active:scale-95 focus:ring-4 focus:ring-green-300"
                  }`}
                >
                  Cambiar a {selectedNanny.state ? "No Disponible" : "Disponible"}
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-300"
              >
                Guardar Cambios
              </button>
              <button
                onClick={handleCloseDetails}
                className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
