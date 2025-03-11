import React, { useState /* , useEffect */ } from "react";
import Modal from "react-modal";
import { updateDocumentFirebase } from "../../services/data-firebase";
import SvgWpp from "../svg/SvgWpp";
import ServiceList from "./ServiceList.jsx";
import ModalDesplazado from "./ModalDesplazado.jsx";
import SvgArrowRGrande from "../svg/SvgArrowRGrande.jsx";
import SvgCloseX from "../svg/SvgCloseX.jsx";
export default function FaderModal({ isOpen, onClose, mothers, reload }) {
  const [selectedMother, setSelectedMother] = useState(null);
  const [showModal, setShowModal] = useState(false); // -------------------

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

  // Function get date of creation

  function convertTimestampToDate(seconds, nanoseconds) {
    // Convertimos seconds y nanoseconds en milisegundos
    const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1e6);
    // Creamos un objeto Date con los milisegundos
    return new Date(milliseconds);
  }


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 overflow-hidden transform transition-transform"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div
        className={`max-h-[90vh]  mb-4 ${!showModal ? "overflow-y-auto" : ""}`}
      >
        {" "}
        {/* Controlo el scroll del modal principal */}
        {!selectedMother ? (
          <div>
            <div className="flex flex-row justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">
                Lista de Padres
              </h2>
              <button
                className="px-3 py-1 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={onClose}
              >
                        <SvgCloseX />
                
              </button>
            </div>
            <ul className="space-y-4">
  {/* Verifica si mothers es un array válido */}
  {Array.isArray(mothers) && mothers.length > 0 ? (
    // Ordenar y dividir la lista
    mothers
      .filter((mother) => mother.services && mother.services.length > 0) // Padres con servicios
      .concat(mothers.filter((mother) => !mother.services || mother.services.length === 0)) // Padres sin servicios
      .map((mother) => (
        <li
          key={mother.idFirestore}
          /* Colores y efectos de hover */
          className="p-4 bg-blue-50 rounded-lg shadow hover:shadow-md cursor-pointer hover:bg-blue-100 transition"
          onClick={() => handleMotherClick(mother)}
          style={{
            border: mother.services && mother.services.length > 0 ? "2px solid #62f584" : "none", // Borde verde si tiene servicios
          }}
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
              mother.sub ? "text-green-600" : "text-red-600"
            }`}
          >
            {mother.sub ? "Sub" : "No Sub"}
          </p>
        </li>
      ))
  ) : (
    <p className="text-gray-600">No se encontraron datos.</p>
  )}
</ul>
            {/*      <div className="mt-6 flex justify-end">
              <button 
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div> */}
          </div>
        ) : (
          <div
            className={`transition-transform duration-300 ${
              showModal ? "-translate-x-1" : ""
            }`}
          >
            <div className="flex flex-row justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-2xl font-extrabold text-gray-800 mb-1 mt-4 tracking-tight">
                Detalles de Padre
              </h2>
              
              <button
                onClick={handleCloseDetails}
                class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
              >
                <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-red-600  rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                          <SvgCloseX />
                </span>
              </button>
            </div>
            {/* Creado  */}
            <div className="space-y-6 bg-white p-6 rounded-xl shadow-lg ring-1 ring-gray-200">
              <div className="group relative flex flex-row justify-between ">
                <div>

                <img src={selectedMother.urlAvatar} alt="" />

                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Usuario Creado
                  </label>
                  <p className="text-sm font-semibold text-gray-700">
                    {selectedMother?.createdAt
                      ? convertTimestampToDate(
                          selectedMother.createdAt.seconds,
                          selectedMother.createdAt.nanoseconds
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

                {/* Botón para mostrar modal */}
                <button
                  onClick={() => setShowModal(true)}
                  className="p-3 bg-[#e085cf] text-white rounded-full shadow-md hover:bg-[#b26aa5] transition"
                >
                 <SvgArrowRGrande/>
                </button>
              </div>

              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nombre
                </label>
                <p className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500">
                  {selectedMother?.name || ""}
                </p>
                {/*     <input
                  type="text"
                  value={selectedMother?.name || ""}
                  onChange={(e) =>
                    setSelectedMother({
                      ...selectedMother,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500"
                /> */}
              </div>

              <div className="flex flex-row gap-4">
                <div className="group relative flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Telefono
                  </label>
                  <p className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500">
                    {selectedMother?.phone || ""}
                  </p>
                </div>
                <div className="group relative flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    WhatsApp:
                  </label>
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
              </div>

              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <p className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500">
                  {selectedMother?.email || ""}
                </p>
              </div>

              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Dirección
                </label>
                <p className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500">
                  {selectedMother?.address || ""}
                </p>
              </div>

              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Barrio
                </label>
                <p className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500">
                  {selectedMother?.neighborhood || ""}
                </p>
              </div>

              <ServiceList services={selectedMother?.services || []} />

              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm ring-1 ring-gray-200">
                <p
                  className={`text-lg font-medium ${
                    selectedMother?.sub ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {selectedMother?.sub ? "Subscripto" : "No Subscripto"}
                </p>
                <button
                  onClick={toggleState}
                  className={`px-6 py-2 font-semibold text-white rounded-lg shadow-md transition-all transform duration-300 ${
                    selectedMother?.sub
                      ? "bg-red-500 hover:bg-red-600 focus:ring-red-300"
                      : "bg-green-500 hover:bg-green-600 focus:ring-green-300"
                  }`}
                >
                  Cambiar a{" "}
                  {selectedMother?.sub ? "No Subscripto" : "Subscripto"}
                </button>
              </div>
            </div>
            {/* Botones de acción */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-all"
              >
                Guardar Cambios
              </button>
              {/* <button
                onClick={handleCloseDetails}
                className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 transition-all"
              >
                Cancelar
              </button> */}
            </div>
            {/* Modal desplazado */}{" "}
            {/* ------------------------------------  implementar los nuevos datos al formulario de niñera */}
            <div
              className={`absolute top-0 right-0 w-full sm:w-2/2 h-full bg-[#381c38e0] shadow-xl transform transition-transform duration-300 ${
                showModal ? "translate-x-0" : "translate-x-full"
              }`}
            >
              {/*    <ModalDesplazado typeModal={'feedback'} setShowModal={setShowModal} /> */}
              <ModalDesplazado
                typeModal={"feedback"}
                setShowModal={setShowModal}
                selectedMother={selectedMother}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
