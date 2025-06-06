import React, { useState } from "react";
import Modal from "react-modal";
import { updateDocumentFirebase } from "../../services/data-firebase";
import SvgWpp from "../svg/SvgWpp";
import ModalDesplazado from "./ModalDesplazado";
import NannyDetails from "./NannyDetails";
import SvgArrowRGrande from "../svg/SvgArrowRGrande";
//import SvgDelet from "../svg/SvgDelet";
import SvgCloseX from "../svg/SvgCloseX";
import SvgCV from "../svg/SvgCV";

export default function NannyModal({ isOpen, onClose, nannies, reload }) {
  const [selectedNanny, setSelectedNanny] = useState(null);
  const [showModal, setShowModal] = useState(false); // -------------------
  const generateWhatsAppLink = (name, phone) => {
    const message = `Hola ${name},te escribimos de Niñeras-Ya, nos gustaría ponernos en contacto contigo.`;
    const encodedMessage = encodeURIComponent(message); 
    return `https://wa.me/${phone}?text=${encodedMessage}`;
  };

  const handleNannyClick = (nanny) => {
    setSelectedNanny(nanny);
  };

  const handleSave = async () => {
    try {
      await updateDocumentFirebase(
        "nana",
        selectedNanny.idFirestore,
        selectedNanny
      );
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
      className="bg-white rounded-lg shadow-xl z-50 max-w-2xl w-full p-6 overflow-hidden transform transition-transform"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <div className={`max-h-[85vh] mb-6 mt-5 ${!showModal?'overflow-y-auto':''}`}> {/* Controlo el scroll del modal principal */}
        {!selectedNanny ? (
          <div>
     <div className="flex flex-row justify-between items-center p-4 border-b border-gray-200">
  <h2 className="text-2xl font-semibold text-gray-800">
    Lista de Niñeras
  </h2>
  <button
    className="px-3 py-1 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    onClick={onClose}
  >
    <SvgCloseX/>
  </button>
</div>
         
         {/* Listado de niñeras */}
         
            <ul className="space-y-4">
              {nannies.map((nanny) => (
                <li
                  key={nanny.idFirestore}
                  className="p-4 bg-blue-50 rounded-lg shadow hover:shadow-md cursor-pointer hover:bg-blue-100 transition"
                  onClick={() => handleNannyClick(nanny)}
                >
                  <p className="text-lg font-medium text-gray-800">
                    {nanny.name}
                  </p>
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
           
            </div>
          </div>
        ) : (
          <>
          
        
          <div className="relative w-full h-full overflow-hidden">
  {/* Contenedor principal */}
  <div
    className={`transition-transform duration-300 ${
      showModal ? "-translate-x-1" : ""
    }`}
  >
    {console.log("selectedNanny", selectedNanny)}
          
          <div className="flex flex-row justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">
Detalle de Niñera              </h2>
              <button
                className="px-3 py-1 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={handleCloseDetails}
              >
                <SvgCloseX/>
              </button>
            </div>
            {/* Creado  */}
            <div className="space-y-4 bg-white p-6 rounded-xl shadow-lg ring-1 ring-gray-200">
              <div className="group relative flex flex-row justify-between ">
              
                      <NannyDetails
                        convertTimestampToDate={convertTimestampToDate}
                        selectedNanny={selectedNanny}
                        onDeleteNanny={(id) => {
                          // Lógica para eliminar la niñera
                        //  console.log("Niñera eliminada:", id);
                        }}
                      />
                {/* Botón para mostrar modal */}
                <button
                  onClick={() => setShowModal(true)}
                  className="p-3 bg-[#e085cf] text-white rounded-full shadow-md hover:bg-[#b26aa5] transition"
                >
               <SvgArrowRGrande/>
                </button>
              </div>

              <div className="flex flex-row gap-4">
                {/* Nombre */}
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={selectedNanny.name}
                    onChange={(e) =>
                      setSelectedNanny({ ...selectedNanny, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md"
                    placeholder="Introduce el nombre"
                  />
                </div>

                {/* Edad */}
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Edad
                  </label>
                  <input
                    type="text"
                    value={selectedNanny.age}
                    onChange={(e) =>
                      setSelectedNanny({ ...selectedNanny, age: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md"
                    placeholder="Introduce la edad"
                  />
                </div>
              </div>

                {/* email */}
                <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="text"
                  value={selectedNanny.email}
                  onChange={(e) =>
                    setSelectedNanny({ ...selectedNanny, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500"
                  placeholder="Introduce el nombre"
                />
              </div>

              <div className="flex flex-row gap-4 items-center">
                {/* Telefono */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">{selectedNanny.phone}</span>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center space-x-2">
                  <a
                    href={generateWhatsAppLink(selectedNanny.name, selectedNanny.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-700 flex items-center space-x-2"
                  >
                    <SvgWpp />
                  </a>
                </div>

                {/* CV */}
                <div className="flex items-center space-x-2">
                  {selectedNanny.cv ? (
                    <a
                      href={selectedNanny.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center space-x-2"
                    >
                      Ver CV <SvgCV />
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500">No hay CV</span>
                  )}
                </div>
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
                    setSelectedNanny({
                      ...selectedNanny,
                      address: e.target.value,
                    })
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

              {/* Disponibilidad */}
              <div className="group relative ">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Disponibilidad
                </label>
                <input
                  type="text"
                  value={selectedNanny.availability}
                  onChange={(e) =>
                    setSelectedNanny({
                      ...selectedNanny,
                      availability: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500"
                  placeholder="Introduce la disponibilidad"
                />
              </div>

              {/* Barrios/Zonas */}
              <div className="group relative ">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Barrios/Zonas
                </label>
                <input
                  type="text"
                  value={selectedNanny.barrioZona.join(", ")} // Asegúrate de que esto sea un array
                  onChange={(e) =>
                    setSelectedNanny({
                      ...selectedNanny,
                      barrioZona: e.target.value.split(", "), // Convertimos el string en array
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500"
                  placeholder="Introduce las zonas o barrios"
                />
              </div>

              {/* Niños */}
              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Niños
                </label>
                <input
                  type="text"
                  value={selectedNanny.children}
                  onChange={(e) =>
                    setSelectedNanny({
                      ...selectedNanny,
                      children: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500"
                  placeholder="Introduce información sobre niños"
                />
              </div>

              {/* Estudios cruzados */}
              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Estudios Cruzados
                </label>
                <input
                  type="text"
                  value={selectedNanny.crossStudies}
                  onChange={(e) =>
                    setSelectedNanny({
                      ...selectedNanny,
                      crossStudies: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500"
                  placeholder="Introduce los estudios"
                />
              </div>

              {/* DNI */}
              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  DNI
                </label>
                <input
                  type="text"
                  value={selectedNanny.dni}
                  onChange={(e) =>
                    setSelectedNanny({ ...selectedNanny, dni: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500"
                  placeholder="Introduce el DNI"
                />
              </div>

              {/* Movilidad */}
              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Movilidad
                </label>
                <input
                  type="text"
                  value={selectedNanny.mobility}
                  onChange={(e) =>
                    setSelectedNanny({
                      ...selectedNanny,
                      mobility: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md group-hover:ring-blue-500"
                  placeholder="Introduce la movilidad"
                />
              </div>

              {/* Subscripción */}
              <div className="group relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Subscripción
                </label>
                <div className="flex items-center space-x-4">
                  <p
                    className={`text-lg font-medium ${
                      selectedNanny.subs ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {selectedNanny.subs ? "Activa" : "Inactiva"}
                  </p>
                  <button
                    onClick={() =>
                      setSelectedNanny((prevNanny) => ({
                        ...prevNanny,
                        subs: prevNanny.subs ? null : true,
                      }))
                    }
                    className={`px-4 py-2 font-semibold rounded-lg shadow-md transition-all duration-300 ${
                      selectedNanny.subs
                        ? "bg-red-500 text-white hover:bg-red-600 focus:ring-4 focus:ring-red-300"
                        : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
                    }`}
                  >
                    {selectedNanny.subs ? "Desactivar Subscripción" : "Activar Subscripción"}
                  </button>
                </div>
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
                  Cambiar a{" "}
                  {selectedNanny.state ? "No Disponible" : "Disponible"}
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
          {/* s */}
            </div>
            
            
      
  {/* Modal desplazado */}    {/* ------------------------------------  implementar los nuevos datos al formulario de niñera */}
  <div
    className={`absolute top-0 right-0 w-full sm:w-2/2 h-[60%] rounded-lg bg-[#381c38e0] shadow-xl transform transition-transform duration-300 ${
      showModal ? "translate-x-0" : "translate-x-full"
    }`}
  >
   
{/*    <ModalDesplazado typeModal={'feedback'} setShowModal={setShowModal} /> */}
   <ModalDesplazado typeModal={'entrevistas'} setShowModal={setShowModal} 
                        selectedNanny={selectedNanny}
   
   />
   
  </div>
</div>
</div>
          </>
        )}
      </div>
    </Modal>
  );
}
