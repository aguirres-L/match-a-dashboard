export default function ModalDesplazado({typeModal,setShowModal}){
    return(
        <>
         
         {typeModal === 'entrevistas'?
         (
            <div className="p-6 text-gray-100">
    
    <div className="flex flex-row justify-between items-center">
    <h2 className="text-2xl font-bold ">Detalles de la Entrevista</h2>
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
   <label className="block text-sm font-semibold mb-1">
     Fecha de la Entrevista
   </label>
   <input
     type="date"
  /*    value={interviewDate} */
  /*    onChange={(e) => setInterviewDate(e.target.value)} */
     className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-[#f83dd6] focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md"
   />
 </div>
 
 {/* Resultado de la entrevista */}
 <div className="space-y-1">
   <p className="block text-sm font-semibold ">Resultado de la Entrevista</p>
   <div className="flex items-center space-x-4">
     <label className="flex items-center space-x-2">
       <input
         type="radio"
         name="interviewResult"
         value="liked"
   /*       checked={interviewResult === "liked"} */
     /*     onChange={(e) => setInterviewResult(e.target.value)} */
         className="h-4 w-4 text-green-500 focus:ring-green-400"
       />
       <span className="text-sm ">Le gustó</span>
     </label>
     <label className="flex items-center space-x-2">
       <input
         type="radio"
         name="interviewResult"
         value="notLiked"
   /*       checked={interviewResult === "notLiked"} */
    /*      onChange={(e) => setInterviewResult(e.target.value)} */
         className="h-4 w-4 text-red-500 focus:ring-red-400"
       />
       <span className="text-sm ">No le gustó</span>
     </label>
   </div>
 </div>
 
 {/* Notas adicionales */}
 <div className="group relative">
   <label className="block text-sm font-semibold  mb-1">
     Notas Adicionales
   </label>
   <textarea
 /*     value={interviewNotes} */
 /*     onChange={(e) => setInterviewNotes(e.target.value)} */
     rows={5}
     className="w-full h-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#f83dd6] focus:outline-none transition duration-300 ease-in-out shadow-sm hover:shadow-md resize-none"
     placeholder="Escribe notas sobre la entrevista aquí..."
   ></textarea>
 </div>
    
     </div>
         ):""}
         
      
     
         {typeModal === 'feedback' ? (
  <div className="flex flex-col h-[100vh] ">
    {/* Cabecera */}
    <div className="flex items-center justify-between p-4 bg-[#e085cf] text-white">
      <h2 className="text-lg font-semibold">Chat de Feedback</h2>
      <button
        onClick={() => setShowModal(false)}
        className="p-2 rounded-full bg-[#c273b4] hover:bg-[#a9619a] transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="white"
            d="M19.3 4.7l-1.4-1.4L12 9.2L6.1 3.3L4.7 4.7L10.6 10.6L4.7 16.5L6.1 17.9L12 12L17.9 17.9L19.3 16.5L13.4 10.6L19.3 4.7z"
          />
        </svg>
      </button>
    </div>

    {/* Zona de Mensajes */}
    <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
      {/* Mensaje recibido */}
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div className="max-w-md bg-white p-3 rounded-xl shadow-sm">
          <p className="text-sm text-gray-700">
            ¡Hola! Nos encantaría escuchar tu opinión sobre el servicio.
          </p>
        </div>
      </div>

      {/* Mensaje enviado */}
      <div className="flex items-end justify-end space-x-3">
        <div className="max-w-md bg-[#e085cf] text-white p-3 rounded-xl shadow-sm">
          <p className="text-sm">¡Gracias! Ha sido una gran experiencia.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#e085cf]"></div>
      </div>
      
      
      
    </div>
    
    
    
    

    {/* Input de Mensajes */}
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-center space-x-3">
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f83dd6] focus:outline-none"
        />
        <button className="p-3 bg-[#e085cf] text-white rounded-full shadow-md hover:bg-[#c273b4] transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="white"
              d="M2 21l21-9L2 3v7l15 2l-15 2v7z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
) : (
  ""
)}

   
        </>
    )
}