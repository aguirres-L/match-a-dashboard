import { useState } from "react";
import { deleteDocumentFirebase, resetServicesArray } from "../../services/data-firebase";

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
      await resetServicesArray("madre", matches[0].mother.idFirestore);

      // Actualizar el estado local después de eliminar el documento
      setMatches((prevMatches) =>
        prevMatches.filter((match) => match.idFirestore !== selectedMatchId)
      );
      console.log(`Match con ID ${selectedMatchId} eliminado exitosamente.`);
      closeModal();
    } catch (error) {
      console.error("Error al eliminar el match:", error);
    }
  };

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
            <h4 className="text-lg font-bold text-gray-800 mb-4">
              Confirmar eliminación
            </h4>
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

function MatchCard({ match, openModal }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li className="bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
      {/* Cabecera de la tarjeta */}
      <div
        className={`p-4 flex justify-between items-center bg-gradient-to-r ${
          isExpanded ? "from-blue-500 to-blue-400" : "from-gray-100 to-gray-50"
        } transition-all duration-300`}
      >
        <div>
          <h4 className="text-lg font-bold text-gray-800">
            {match.nanny.name} & {match.mother.name}
          </h4>
          <p className="text-sm text-gray-600">
            Barrio: {match.nanny.neighborhood} / {match.mother.neighborhood}
          </p>
        </div>
        <button
          className={`px-3 py-1 text-sm font-medium rounded ${
            isExpanded
              ? "bg-white text-blue-500 hover:bg-gray-100"
              : "bg-blue-500 text-white hover:bg-blue-600"
          } shadow-md transition-all duration-300`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Contraer" : "Expandir"}
        </button>
      </div>

      {/* Pie de la tarjeta */}
      <div className="p-4 flex justify-end bg-gray-50">
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
