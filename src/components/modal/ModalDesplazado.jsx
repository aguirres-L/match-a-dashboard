import { useEffect, useState } from "react";
import SvgBad from "../svg/SvgBad";
import SvgCloseX from "../svg/SvgCloseX";
import SvgHappy from "../svg/SvgHappy";
import { updateDocumentFirebase } from "../../services/data-firebase";
// Verifica si selectedMother y sus propiedades están definidas

export default function ModalDesplazado({ typeModal, setShowModal, selectedMother ,selectedNanny }) {
  //const hasServices = selectedMother?.services?.length > 0;
 // const hasChats = hasServices && selectedMother.services[0]?.chats?.length > 0;

 const [interviewDate, setInterviewDate] = useState("");
 const [interviewResult, setInterviewResult] = useState("");
 const [interviewNotes, setInterviewNotes] = useState("");

  // Inicializa los estados con los valores de selectedNanny.interview
  useEffect(() => {
    if (selectedNanny?.interview) {
      setInterviewDate(selectedNanny.interview.fecha || "");
      setInterviewResult(selectedNanny.interview.state ? "liked" : "notLiked");
      setInterviewNotes(selectedNanny.interview.detail || "");
    }
  }, [selectedNanny]); // Se ejecuta cuando selectedNanny cambia



 const saveDateOfEntrevista = async () => {
   if (!selectedNanny || !selectedNanny.idFirestore) {
     alert("No se ha seleccionado una niñera válida.");
     return;
   }

   const updatedInterview = {
     state: interviewResult === "liked",
     detail: interviewNotes,
     fecha: interviewDate,
   };

   try {
     await updateDocumentFirebase("nana", selectedNanny.idFirestore, {
       interview: updatedInterview,
     });
     alert("Entrevista guardada exitosamente.");
     setShowModal(false);
   } catch (error) {
     console.error("Error al guardar la entrevista:", error);
     alert("Hubo un error al guardar la entrevista.");
   }
 };
/*   console.log(selectedMother.services[0]?.chats,'dato from modalDesplazado');
   */
  return (
    <>
      {typeModal === 'entrevistas' ? (
        <div className="p-4  text-gray-100">
          {/* Contenido del modal de entrevistas */}
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-2xl font-bold">Detalles de la Entrevista</h2>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 p-3 bg-[#e085cf] text-white rounded-full shadow-md hover:bg-[#c273b4] transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="#e9e2e2" d="m14 18l-6-6l6-6l1.4 1.4l-4.6 4.6l4.6 4.6z" />
              </svg>
            </button>
          </div>
          <p>Registra los detalles de la entrevista con la niñera.</p>

          {/* Fecha de la entrevista */}
          <div className="group relative">
            <label className="block text-sm font-semibold mb-1">Fecha de la Entrevista</label>
            <input
              type="date"
             value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-[#f83dd6] focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md"
            />
          </div>

          {/* Resultado de la entrevista */}
          <div className="space-y-1">
            <p className="block text-sm font-semibold">Resultado de la Entrevista</p>
            <div className="flex items-center space-x-4 justify-center">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="interviewResult"
                  value="liked"
                  className="h-4 w-4 text-green-500 focus:ring-green-400"

                  checked={interviewResult === "liked"}
                  onChange={() => setInterviewResult("liked")}

                />
             <SvgHappy/>

                <span className="text-sm">Le gustó</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="interviewResult"
                  value="notLiked"

                  checked={interviewResult === "notLiked"}
                  onChange={() => setInterviewResult("notLiked")}

                  className="h-4 w-4 text-red-500 focus:ring-red-400"
                />
           <SvgBad/> 
                <span className="text-sm">No le gustó</span>
              </label>
            </div>
          </div>

          {/* Notas adicionales */}
          <div className="group relative">
            <label className="block text-sm font-semibold mb-1">Notas Adicionales</label>
            <textarea
              rows={5}
              value={interviewNotes}
              onChange={(e) => setInterviewNotes(e.target.value)}
              className="w-full h-[50vh] px-4 py-3 rounded-lg border text-gray-950 border-gray-300 focus:ring-2 focus:ring-[#f83dd6] focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md resize-none"
              placeholder="Escribe notas sobre la entrevista aquí..."
            ></textarea>
          </div>
          <button onClick={saveDateOfEntrevista} className="p-2 rounded-sm bg-green-500" >Guardar</button>
        </div>
      ) : null}

{typeModal === 'feedback' ? (
  <div className="flex flex-col h-[95vh]">
    {/* Cabecera */}
    <div className="flex items-center justify-between p-4 bg-[#e085cf] text-white">
      <h2 className="text-lg font-semibold">Feedback de {selectedMother?.name || "Madre"}</h2>
      <button
        onClick={() => setShowModal(false)}
        className="p-2 rounded-full bg-[#c273b4] hover:bg-[#a9619a] transition"
      >
        <SvgCloseX />
      </button>
    </div>

    {/* Zona de Mensajes */}
    <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
      {selectedMother?.services?.[0]?.chats?.length > 0 ? (
        selectedMother.services[0].chats.map((chat, index) => (
          <div key={index} className="flex items-start space-x-3">
            {/* Avatar del remitente */}
            <div className="w-10 h-10 rounded-full bg-gray-300">
              <img
                src={selectedMother.urlAvatar || ''}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            {/* Mensaje */}
            <div className="max-w-md bg-white p-3 rounded-xl shadow-sm">
              <p className="text-sm text-gray-700">
                <strong>{chat.sender}:</strong> {chat.text}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No hay mensajes</p>
      )}
    </div>
  </div>
) : null}
    </>
  );
}