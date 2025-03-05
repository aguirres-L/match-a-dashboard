import { useState } from "react";
import { deleteDocumentFirebase, resetServicesArray } from "../../services/data-firebase";
import SvgWpp from "../svg/SvgWpp";
import SvgArrowUnder from "../svg/SvgArrowUnder";
import SvgArrowUP from "../svg/SvgArrowUP";
import SvgDelet from "../svg/SvgDelet";

export default function ZonaMatch({ matches, setMatches }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState(null);

  const openModal = (matchId) => {
    setSelectedMatchId(matchId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMatchId(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      // Eliminar el documento de Firebase
      await deleteDocumentFirebase("match", selectedMatchId);
      await resetServicesArray("madre", matches[0]?.mother.idFirestore);

      // Actualizar el estado local después de eliminar el documento
      setMatches((prevMatches) =>
        prevMatches.filter((match) => match.idFirestore !== selectedMatchId)
      );
   /*    console.log(`Match con ID ${selectedMatchId} eliminado exitosamente.`); */
      closeModal();
    } catch (error) {
      console.error("Error al eliminar el match:", error);
    }
  };

/* console.log( matches[0].mother.idFirestore,'555'); */


  return (
    <div className="mt-6 bg-gray-50 shadow-md rounded-lg p-6 w-full max-w-4xl mx-auto">
      <h3 className="text-2xl font-extrabold text-gray-800 mb-6">Matches Creados</h3>
      <ul className="space-y-6">
        {matches?.map((match) => (
          <MatchCard
            key={match.idFirestore}
            match={match}
            openModal={openModal}
          />
        ))}
      </ul>

      {/* Modal de confirmación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <div className="flex flex-row">
            <h4 className="text-lg font-bold text-gray-800 mb-4">
              Confirmar eliminación
            </h4>

              <SvgDelet/>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar este match? Esta acción no se
              puede deshacer.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


const generateWhatsAppLink = (name, phone) => {
  const message = `Hola ${name}, me gustaría ponerme en contacto contigo.`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};


function MatchCard({ match, openModal }) {
  const [isExpanded, setIsExpanded] = useState(false);
/* console.log(match,'match'); */

  return (
    <li className="bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
      {/* Cabecera de la tarjeta */}
      <div
        className={`p-4 flex justify-between items-center bg-gradient-to-r ${
          isExpanded ? "from-[#e085cf] to-blue-400" : "from-[#e085cf] to-blue-100"
        } transition-all duration-300`}
      >
        <div>
        <h4 className="text-lg font-bold text-white">
        <span className="text-blue-200"> {match.nanny.name}</span> & <span className="text-green-300"> {match.mother.name}</span>
          </h4>
          <p className="text-sm text-gray-100">
            Barrio: <span className="text-blue-200"> {match.nanny.neighborhood}</span> / <span className="text-green-300" > {match.mother.neighborhood}</span>
          </p>
        </div>
        <button
          className={`px-3 py-1 text-sm font-medium rounded ${
            isExpanded
              ? "bg-white text-white hover:bg-gray-100"
              : "bg-white text-white hover:bg-gray-100"
          } shadow-md transition-all duration-300`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <SvgArrowUP/> : <SvgArrowUnder/>}
          {/* {isExpanded ? "Contraer" : "Expandir"} */}
        </button>
      </div>

      {/* Contenido expandido */}
      {isExpanded && (
        <div className="p-6 bg-gray-50 text-gray-700">
          <h5 className="text-md font-bold mb-4 border-b border-gray-300 pb-2">
            Detalles del Match
          </h5>

          {/* Datos de la Madre */}
          <div className="mb-6">
            <h6 className="text-lg font-semibold text-gray-800 mb-2">
              Datos de la Madre:
            </h6>
            <ul className="space-y-1 text-sm">
              <li><strong>Nombre:</strong> {match.mother.name}</li>
              <li><strong>Email:</strong> {match.mother.email}</li>
              <li className="flex flex-row"  ><strong>Contacto: </strong>  <a
                  href={generateWhatsAppLink(
                    match.mother.name,
                    match.mother.phone
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SvgWpp/>
                  
                </a></li>
              
              <li><strong>Dirección:</strong> {match.mother.address}</li>
              <li><strong>Barrio:</strong> {match.mother.neighborhood}</li>
          {/*     <li><strong>Horario:</strong> {match.mother.schedule}</li> */}
              {/* Servicios */}
              {match.mother.services?.length > 0 && (
                <li className="mt-4">
                  <h6 className="text-sm font-semibold text-gray-600">
                    Servicios:
                  </h6>
                  <div className="grid gap-4 mt-2">
                    {match.mother.services.map((service, index) => (
                      <div
                        key={index}
                        className="p-3 bg-blue-100 rounded-lg shadow-sm border border-blue-300"
                      >
                        {console.log(service)}
                     
{/* Detalle del servicio desde match  */}
                     
{/* tipo de servicio  */}
                        <p className="text-sm">
                          <strong>Tipo de Servicio:</strong>{" "}
                          <span className="text-blue-700">
                            {service.contratacion}
                          </span>
                        </p>
{/* Dias re queridos  */}
                        <p className="text-sm">
                          <strong>Días:</strong>{" "}
                          <span className="text-blue-700">
                            {service.days.join(", ")}
                          </span>
                        </p>

                        {/* Horario */}
                        <p className="text-sm">
                          <strong>Horario:</strong>{" "}
                          <span className="text-blue-700">
                            {service.schedule}
                          </span>
                        </p>
                        <br />
{/* Economica*/}
                        <p className="text-sm">
                          <strong>Propuesta Economica:</strong>{" "}
                          <span className="text-blue-700">
                            {service.propuestaEconomica}
                          </span>
                        </p>
{/* Tipo de pago */}
                        <p className="text-sm">
                          <strong>Tipo de Pago:</strong>{" "}
                          <span className="text-blue-700">
                            {service.typePago}
                          </span>
                        </p>
                        

{/* Zonas Barrios */}

<p className="text-sm">
  <strong>Barrios/Zona:</strong>{" "}
  {service.barrioZona.join(", ")} {/* Mostrará: Alta Córdoba, Nueva Córdoba, Cerro de las Rosas */}

</p>

<br />

{/* Cantidad de niños */}
<p className="text-sm">
                          <strong>Cantidad de Niños:</strong>{" "}
                          <span className="text-blue-700">
                            {service.childer.length}
                          </span>
                        </p>

                      </div>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Datos de la Niñera */}
          <div>
            <h6 className="text-lg font-semibold text-gray-800 mb-2">
              Datos de la Niñera:
            </h6>
            <ul className="space-y-1 text-sm">
              <li><strong>Nombre:</strong> {match.nanny.name}</li>
              <li><strong>Email:</strong> {match.nanny.email}</li>
              <li className="flex flex-row"  ><strong>Contacto: </strong>  <a
                  href={generateWhatsAppLink(
                    match.nanny.name,
                    match.nanny.phone
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SvgWpp/>
                </a></li>
              <li><strong>Dirección:</strong> {match.nanny.address}</li>
              <li><strong>Barrio:</strong> {match.nanny.neighborhood}</li>
              <li><strong>Disponibilidad:</strong> {match.nanny.availability}</li>
              <li>
                <strong>CV:</strong>{" "}
                <a
                  href={match.nanny.cv}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver CV
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Pie de la tarjeta */}
      <div className="p-4 flex justify-end bg-gray-100">
        <button
          className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded shadow hover:bg-red-600 transition-all duration-300"
          onClick={() => openModal(match.idFirestore)}
        >
          Eliminar Match
        </button>
      </div>
    </li>
  );
}
