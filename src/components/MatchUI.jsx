import React, { useEffect, useState } from "react";
import { addDocumentFirebase, getDocumentsFirebase,  updateDocumentServiceState } from "../services/data-firebase";
import Modal from "react-modal";
import ModalUser from "./modal/ModalUser";
import ZonaMatch from "./zonaMatch/ZonaMatch";

Modal.setAppElement("#root");


function NannyModal({ isOpen, onClose, nannies }) {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="bg-white p-6 rounded shadow-lg max-w-lg mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">Lista de Niñeras</h2>
        <ul className="space-y-2">
          {nannies.map((nanny) => (
            <li
              key={nanny.idFirestore}
              className="p-3 bg-blue-100 rounded hover:bg-blue-200"
            >
              <p className="font-bold">{nanny.name}</p>
              <p className="text-sm">{nanny.address}</p>
              <p className="text-sm">{nanny.neighborhood}</p>
            </li>
          ))}
        </ul>
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={onClose}
        >
          Cerrar
        </button>
      </Modal>
    );
  }







function MatchUI() {
  const [matches, setMatches] = useState([]);
  const [nannies, setNannies] = useState([]);
  const [mothers, setMothers] = useState([]);
  const [selectedNanny, setSelectedNanny] = useState(null);
  const [selectedMother, setSelectedMother] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const [reloadData, setReloadData] = useState(false);

  const [isNannyModalOpen, setIsNannyModalOpen] = useState(false);



  useEffect(() => {
    async function getAllUsers() {
      try {
        const madre = await getDocumentsFirebase("madre");
        const nana = await getDocumentsFirebase("nana");
        const matchesFirebase = await getDocumentsFirebase("match");
    
        const mothersWithServices = madre.filter(
          (mother) =>
            mother.services &&
            mother.services.length > 0 &&
            mother.services.some((service) => service.state !== true)
        );
       /*  const nanniesWithStateTrue = nana.filter((nanny) => nanny.state === true);
     */
        setMothers(mothersWithServices);
     /*    setNannies(nanniesWithStateTrue); */
        setNannies(nana);
        setMatches(matchesFirebase);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    }
  
    getAllUsers();
  }, [reloadData]); // Escucha cambios en `reloadData`
  
  
// Usar esta función para disparar la recarga de datos
function reload() {
    setReloadData((prev) => !prev);
  }
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Ocultar notificación después de 3 segundos
  };

  const handleMatch = async () => {
    if (!selectedNanny || !selectedMother) {
      showNotification("Debe seleccionar una Niñera y una Madre para crear un Match", "error");
      return;
    }
    const matchExists = matches.some(
      (match) =>
        match.nanny.idFirestore === selectedNanny.idFirestore &&
        match.mother.idFirestore === selectedMother.idFirestore
    );
    if (matchExists) {
      showNotification("Este match ya existe", "error");
      return;
    }
    
    

    const newMatch = { // datos a fireabse collection match
      nanny: selectedNanny,
      mother: selectedMother,
 /*      id: Date.now(), */
      idNana: selectedNanny.idFirestore,
    };
    
  
  try {
    await updateDocumentServiceState("madre", selectedMother.idFirestore, 0, true);
    await addDocumentFirebase('match', newMatch) // Se almacena los datos en Firebase para "match"
  } catch (error) {
    console.log(error)
  }
  reload();
    
    setMatches([...matches, newMatch]);
    setSelectedNanny(null);
    setSelectedMother(null);
    showNotification("¡Match creado exitosamente!", "success");
  };

/*   const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }; */

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const onDragStart = (event, item, type) => {
    setDragging(true);
    event.dataTransfer.setData("item", JSON.stringify({ item, type }));
  };

  const onDrop = (event, type) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("item"));

    if (type === "nanny" && data.item.userType === "nana") {
      setSelectedNanny(data.item);
      showNotification("Niñera seleccionada correctamente", "success");
    } else if (type === "mother" && data.item.userType === "madre") {
      setSelectedMother(data.item);
      showNotification("Madre seleccionada correctamente", "success");
    } else {
      showNotification("Usuario no válido para esta sección", "error");
    }
    setDragging(false);
  };

  const clearSelection = (type) => {
    if (type === "nanny") setSelectedNanny(null);
    if (type === "mother") setSelectedMother(null);
    showNotification("Selección eliminada", "info");
  };


///  Modal

const toggleNannyModal = () => {
    setIsNannyModalOpen(!isNannyModalOpen);
  };

///  Modal


  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Sistema de Match</h1>
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}
      
      
         {/* Botón flotante */}
         <button
        className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600"
        onClick={toggleNannyModal}
      >
        Niñeras
      </button>

      {/* Modal de niñeras */}
      <NannyModal
        isOpen={isNannyModalOpen}
        onClose={toggleNannyModal}
        nannies={nannies}
      />
      
      
      
      <div className="flex gap-6 w-full max-w-6xl">
        {/* Niñeras */}
        <div className="flex-1 bg-white shadow rounded p-4">
  <h2 className="text-lg font-bold mb-4">Niñeras</h2>
  <ul className="space-y-2">
    {nannies.map((nanny) => (
      <li
        key={nanny.idFirestore}
        className={`p-3 rounded cursor-pointer ${
          nanny.state === true
            ? "bg-blue-100 hover:bg-blue-200"
            : "bg-gray-300 cursor-not-allowed"
        }`}
        draggable={nanny.state === true} // Solo hacerlas "draggable" si `state` es true
        onDragStart={
          nanny.state === true
            ? (event) => onDragStart(event, nanny, "nanny")
            : (event) => {
                event.preventDefault(); // Evita el arrastre
                showNotification(
                  "Esta niñera no está disponible para hacer un match",
                  "error"
                );
              }
        }
      >
      <div className="flex flex-row justify-between">
        <p className="font-bold">{nanny.name}</p>
        <p className={`text-xs font-bold ${nanny.state ? "text-green-500" : "text-red-500"}`}>
          {nanny.state ? "" : "No Disponible"}
        {/*   {nanny.state ? "Disponible" : "No Disponible"} */}
        </p>
      </div>
        <p className="text-sm">{nanny.address}</p>
        <p className="text-sm">{nanny.neighborhood}</p>
       
      </li>
    ))}
  </ul>
</div>


        {/* Madres */}
        <div className="flex-1 bg-white shadow rounded p-4">
          <h2 className="text-lg font-bold mb-4">Madres</h2>
          <ul className="space-y-2">
            {mothers.map((mother) => (
              <li
                key={mother.idFirestore}
                className={`p-3 rounded cursor-pointer ${
                  dragging ? "bg-pink-200" : "bg-pink-100"
                } hover:bg-pink-300`}
                draggable
                onDragStart={(event) => onDragStart(event, mother, "mother")}
              >
                <p className="font-bold">{mother.name}</p>
                <p className="text-sm">{mother.address}</p>
                <p className="text-sm">{mother.neighborhood}</p>
                
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Zona de Creación de Matches */}
      <div className="flex flex-col items-center mt-6 bg-gray-200 shadow rounded p-4 w-full max-w-4xl">
        <h2 className="text-lg font-bold mb-4">Crear Match</h2>
        <div className="flex gap-4">
          {/* Zona de Niñeras */}
          <div
            className={`flex-1 p-4 bg-white rounded shadow ${
              dragging && "border-2 border-blue-400"
            }`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => onDrop(event, "nanny")}
          >
            <h3 className="text-md font-bold mb-2">Niñera Seleccionada</h3>
            {selectedNanny ? (
              <div className="p-3 bg-blue-100 rounded flex justify-between items-center">
                <div>
                  <p className="font-bold">{selectedNanny.name}</p>
                  <p className="text-sm">{selectedNanny.address}</p>
                </div>
                <button
                  className="text-red-500 font-bold"
                  onClick={() => clearSelection("nanny")}
                >
                  X
                </button>
              </div>
            ) : (
              <p className="text-gray-500 italic">Arrastra una niñera aquí</p>
            )}
          </div>

          {/* Zona de Madres */}
          <div
            className={`flex-1 p-4 bg-white rounded shadow ${
              dragging && "border-2 border-pink-400"
            }`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => onDrop(event, "mother")}
          >
            <h3 className="text-md font-bold mb-2">Madre Seleccionada</h3>
            {selectedMother ? (
              <div className="p-3 bg-pink-100 rounded flex justify-between items-center">
                <div>
                  <p className="font-bold">{selectedMother.name}</p>
                  <p className="text-sm">{selectedMother.address}</p>
                </div>
                <button
                  className="text-red-500 font-bold"
                  onClick={() => clearSelection("mother")}
                >
                  X
                </button>
              </div>
            ) : (
              <p className="text-gray-500 italic">Arrastra una madre aquí</p>
            )}
          </div>
        </div>
        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleMatch}
        >
          Crear Match
        </button>
      </div>

  {/* Zona de Matches */}
<ZonaMatch matches={matches} setMatches={setMatches} />

      {/* Modal */}
      <ModalUser
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        selectedItem={selectedItem}
      />
    </div>
  );
}

export default MatchUI;
