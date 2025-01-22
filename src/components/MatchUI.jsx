import React, { useEffect, useState } from "react";
import {
  addDocumentFirebase,
  getDocumentsFirebase,
  updateDocumentServiceState,
} from "../services/data-firebase";
import Modal from "react-modal";
import ZonaMatch from "./zonaMatch/ZonaMatch";
import Refresh from "./ui/refresh/Refresh";
import RefreshMadre from "./ui/refresh/RefreshMadre";
import NannyModal from "./modal/NannyModal";
import { useIsWeb } from "../hooks/useIsWeb";
import FaderModal from "./modal/FaderModal";

Modal.setAppElement("#root");
function MatchUI() {
  const [matches, setMatches] = useState([]);
  const [nannies, setNannies] = useState([]);
  const [mothers, setMothers] = useState([]);
  const [selectedNanny, setSelectedNanny] = useState(null);
  const [selectedMother, setSelectedMother] = useState(null);
  const [dragging, setDragging] = useState(false);

  const [notification, setNotification] = useState(null);

  const [reloadData, setReloadData] = useState(false);

// state for modals
  const [isNannyModalOpen, setIsNannyModalOpen] = useState(false);
  const [isFaderModal, setIsFaderModal] = useState(false);

  const [refesh, setRefesh] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinningMadre, setIsSpinningMadre] = useState(false);

  // hook isWeb
  let isSeeWeb = useIsWeb();
  /* console.log(isSeeWeb,'isWeb ?'); */

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
  }, [reloadData, refesh]); // Escucha cambios en `reloadData`

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
      showNotification(
        "Debe seleccionar una Niñera y una Madre para crear un Match",
        "error"
      );
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

    const newMatch = {
      // datos a fireabse collection match
      nanny: selectedNanny,
      mother: selectedMother,
      /*      id: Date.now(), */
      idNana: selectedNanny.idFirestore,
    };

    try {
      await updateDocumentServiceState(
        "madre",
        selectedMother.idFirestore,
        0,
        true
      );
      await addDocumentFirebase("match", newMatch); // Se almacena los datos en Firebase para "match"
    } catch (error) {
      console.log(error);
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

  
  
  
  
  
  /// Opne Modal

  const toggleNannyModal = () => {
    setIsNannyModalOpen(!isNannyModalOpen);
  };
  const toogleFaderMOdal=()=>{
    setIsFaderModal(!isFaderModal)
  }
  
  
  
  
  
  

  ///  refesh

  function clickRefresh() {
    setRefesh(!refesh);
    // Inicia el giro al hacer clic
    setIsSpinning(true);

    // Detiene el giro después de 1 segundo (simulando una acción, como un "refresh")
    setTimeout(() => {
      setIsSpinning(false);
    }, 1000);
  }
  function clickRefreshMadre() {
    setRefesh(!refesh);
    // Inicia el giro al hacer clic
    setIsSpinningMadre(true);

    // Detiene el giro después de 1 segundo (simulando una acción, como un "refresh")
    setTimeout(() => {
      setIsSpinningMadre(false);
    }, 1000);
  }
  
  console.log(mothers,'mothers mothers');
  

  return (
    <div/*  style={{border:"solid 2px red"}} */ className="flex w-screen flex-col items-center bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Sistema de Match</h1>
      
      {/* Nitificaciones */}
      {notification && (
        <div
          className={`fixed z-50 top-4 right-4 p-4 rounded shadow-lg ${
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

      {/* ------------ Button Flotante ---------------------- */}


      {/* Botón flotante */}
      <button
        className="fixed z-0 bottom-24 right-2 md:right-4 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600"
        onClick={toogleFaderMOdal}
      >
        Padres
      </button>
      
      {/* Modal de padres */}
      <FaderModal
        isOpen={isFaderModal}
        onClose={toogleFaderMOdal}
        mothers={mothers}
        reload={reload}
      />
      
      {/* Botón flotante */}
      <button
        className="fixed bottom-6 z-0 right-2 md:right-4 z bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600"
        onClick={toggleNannyModal}
      >
        Niñeras
      </button>

      {/* Modal de niñeras */}
      <NannyModal
        isOpen={isNannyModalOpen}
        onClose={toggleNannyModal}
        nannies={nannies}
        reload={reload}
      />
      {/* ------------ Button Flotante ---------------------- ---------------------- */}




      {/* ------------ Profesionales y Clientes ---------------------- ---------------------- */}

      <div className="flex gap-6 w-full sm:flex-row flex-col max-w-6xl">
      
          {/* Madres  --------------------- ---------------------- -----------------------*/}
          <div className="flex-1 bg-white shadow rounded p-4">
          <div className="flex flex-row justify-between mb-4">
            <h2 className="text-lg font-bold mb-4">Padres</h2>
            <button
              onClick={clickRefreshMadre}
              className={`p-4 rounded-full transition-all duration-300 ${
                isSpinningMadre
                  ? "bg-green-200 hover:bg-green-300"
                  : "bg-gray-200 hover:bg-gray-300"
              } focus:outline-none active:scale-95`}
            >
              {/* Pasamos `isSpinning` al componente Refresh */}
              <RefreshMadre typeUser={2} isSpinningMadre={isSpinningMadre} />
            </button>
          </div>
          <ul className="space-y-2 z-0 max-h-[300px] overflow-y-auto">
            {mothers.map((mother) => (
              <li
                key={mother.idFirestore}
                className={`p-3 rounded-lg  ${
                  dragging ? "bg-green-200" : "bg-green-100"
                } hover:bg-green-200 `}
                draggable
                onDragStart={(event) => onDragStart(event, mother, "mother")}
              >
                <p className="font-semibold text-lg text-gray-800 truncate">
                  {mother.name}
                </p>
                <p className="text-sm text-gray-600 break-words">
                  {mother.address}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {mother.neighborhood}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium ">Horario:</span>{" "}
                  {mother.services[0]?.schedule || "No especificado"}
                  {/*     {console.log(mother.services[0]?.schedule,'tipo ')} */}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Plan:</span>{" "}
                  {mother.services[0]?.plan || "No especificado"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Días:</span>{" "}
                  {mother.services[0]?.days?.join(" ") || "No especificado"}
                </p>
              </li>
            ))}
          </ul>
        </div>
        {/* Niñeras  ----------------------*/}
        <div className="flex-1 bg-white shadow rounded p-4">
          <div className="flex flex-row justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Niñeras</h2>
            <button
              onClick={clickRefresh}
              className={`p-4 rounded-full transition-all duration-300 ${
                isSpinning
                  ? "bg-blue-200 hover:bg-blue-300"
                  : "bg-gray-200 hover:bg-gray-300"
              } focus:outline-none active:scale-95`}
            >
              {/* Pasamos isSpinning al componente Refresh */}
              <Refresh typeUser={1} isSpinning={isSpinning} />
            </button>
          </div>

          {/* Lista de Niñeras con Scroll */}
          <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
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
                  <p
                    className={`text-xs font-bold ${
                      nanny.state ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {nanny.state ? "" : "No Disponible"}
                  </p>
                </div>
                <p className="text-sm">{nanny.address}</p>
                <p className="text-sm">{nanny.neighborhood}</p>
              </li>
            ))}
          </ul>
        </div>

    
      </div>

{/* ------------ Profesionales y Clientes ---------------------- ---------------------- */}






      {/* ------------ Zona de Matchs ----------------------  -------------------------------*/}

      {/* Zona de Creación de Matches  --------------------- -----------------------*/}
      <div className="flex flex-col items-center mt-6 bg-gray-200 shadow rounded p-4 w-full max-w-4xl">
        <h2 className="text-lg font-bold mb-4"> Match</h2>

        <div className="flex gap-4 flex-col md:flex-row">
          {isSeeWeb ? (
            /* Zona de Niñeras web */

            <div
              className={` hidden md:block   flex-1 p-4 bg-white rounded shadow ${
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
          ) : (
            /* Mobile */
            <div className="block md:hidden">
              <h3>Seleccionar Niñera</h3>
              <select
                className="p-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-gray-700"
                onChange={(e) => {
                  setSelectedNanny(
                    nannies.find((n) => n.idFirestore === e.target.value)
                  );
                  /*               console.log(e.target.value,'ss'); */
                }}
              >
                <option value="" className="text-gray-400">
                  Selecciona una niñera
                </option>
                {nannies
                  .filter((nanni) => nanni.state === true)
                  .map((nanny) => (
                    <option key={nanny.idFirestore} value={nanny.idFirestore}>
                      {nanny.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {isSeeWeb ? (
            /* Madre  */
            <div
              className={`hidden md:block   flex-1 p-4 bg-white rounded shadow ${
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
                    <p className="text-sm">
                      Plan - {selectedMother.services[0]?.plan}
                    </p>
                    {/*    {console.log(selectedMother, "selector")} */}
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
          ) : (
            /* Mobile */
            <div className="block md:hidden">
              <h3>Seleccionar Madre</h3>
              <select
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700"
                onChange={(e) =>
                  setSelectedMother(
                    mothers.find((m) => m.idFirestore === e.target.value)
                  )
                }
              >
                <option value="" className="text-gray-400">
                  Selecciona una madre
                </option>
                {mothers.map((mother) => (
                  <option key={mother.idFirestore} value={mother.idFirestore}>
                    {mother.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/*  ---------------------- ---------------- ---------------------- ----------------------*/}
        </div>

        <button
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleMatch}
        >
          Crear Match
        </button>
      </div>

      {/* Zona de Matches  ---------------------- ---------------------- ----------------------*/}
      {matches && <ZonaMatch matches={matches} setMatches={setMatches} />}
      {/* ------------ Zona de Matchs ---------------------- */}
    </div>
  );
}

export default MatchUI;
