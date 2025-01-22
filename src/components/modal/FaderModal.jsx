import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { updateDocumentFirebase } from "../../services/data-firebase";
import SvgWpp from "../svg/SvgWpp";

export default function FaderModal({ isOpen, onClose, mothers, reload }) {
  const [selectedMother, setSelectedMother] = useState(null);

  // Verifica si los datos de "mothers" llegan correctamente
/*   useEffect(() => {
    console.log("Datos de mothers:", mothers);
  }, [mothers]); */

  const generateWhatsAppLink = (name, phone) => {
    const message = `Hola ${name}, me gustaría ponerme en contacto contigo.`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  };

  const handleMotherClick = (mother) => {
    setSelectedMother(mother);
  };

  const handleSave = async () => {
    if (!selectedMother) return;

    try {
      await updateDocumentFirebase(
        "mothers",
        selectedMother.idFirestore,
        selectedMother
      );
      reload(); // Recarga los datos tras guardar
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
    setSelectedMother(null);
  };

  const handleCloseDetails = () => {
    setSelectedMother(null);
  };

  const toggleState = () => {
    setSelectedMother((prevMother) => ({
      ...prevMother,
      state: !prevMother?.state,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 overflow-hidden transform transition-transform"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className="max-h-[90vh] overflow-y-auto">
        {!selectedMother ? (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Lista de Padres
            </h2>
            <ul className="space-y-4">
              {/* Verifica si mothers es un array válido */}
              {Array.isArray(mothers) && mothers.length > 0 ? (
                mothers.map((mother) => (
                  <li
                    key={mother.idFirestore}
                    className="p-4 bg-blue-50 rounded-lg shadow hover:shadow-md cursor-pointer hover:bg-blue-100 transition"
                    onClick={() => handleMotherClick(mother)}
                  >
                
                    <p className="text-lg font-medium text-gray-800">
                      {mother.name || "Sin nombre"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {mother.address || "Dirección no disponible"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {mother.neighborhood || "Barrio no disponible"}
                    </p>
                    <p
                      className={`text-sm font-semibold mt-2 ${
                        mother.state ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {mother.state ? "Disponible" : "No Disponible"}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-gray-600">No se encontraron datos.</p>
              )}
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
          <div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 tracking-tight">
              Detalles de la Madre
            </h2>
            <div className="space-y-6 bg-white p-6 rounded-xl shadow-lg ring-1 ring-gray-200">
              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={selectedMother?.name || ""}
                  onChange={(e) =>
                    setSelectedMother({
                      ...selectedMother,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500"
                />
              </div>

              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={selectedMother?.address || ""}
                  onChange={(e) =>
                    setSelectedMother({
                      ...selectedMother,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500"
                />
              </div>

              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Barrio
                </label>
                <input
                  type="text"
                  value={selectedMother?.neighborhood || ""}
                  onChange={(e) =>
                    setSelectedMother({
                      ...selectedMother,
                      neighborhood: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500"
                />
              </div>

              <div className="group relative flex items-center space-x-4">
                <p className="text-sm font-semibold text-gray-700">WhatsApp:</p>
                <a
                  href={generateWhatsAppLink(
                    selectedMother?.name || "",
                    selectedMother?.phone || ""
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-700 flex items-center space-x-2"
                >
                  <SvgWpp />
                  <span>Abrir Chat</span>
                </a>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm ring-1 ring-gray-200">
                <p
                  className={`text-lg font-medium ${
                    selectedMother?.state ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {selectedMother?.state ? "Disponible" : "No Disponible"}
                </p>
                <button
                  onClick={toggleState}
                  className={`px-6 py-2 font-semibold text-white rounded-lg shadow-md transition-all transform duration-300 ${
                    selectedMother?.state
                      ? "bg-red-500 hover:bg-red-600 focus:ring-red-300"
                      : "bg-green-500 hover:bg-green-600 focus:ring-green-300"
                  }`}
                >
                  Cambiar a{" "}
                  {selectedMother?.state ? "No Disponible" : "Disponible"}
                </button>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all"
              >
                Guardar Cambios
              </button>
              <button
                onClick={handleCloseDetails}
                className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
