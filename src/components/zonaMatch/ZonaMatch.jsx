import { deleteDocumentFirebase, resetServicesArray } from "../../services/data-firebase";

export default function ZonaMatch({ matches, setMatches }) {
  const handleDelete = async (matchId) => {
    try {
      // Eliminar el documento de Firebase
      await deleteDocumentFirebase("match", matchId);
     await resetServicesArray('madre', matches[0].mother.idFirestore) // elimino la cita en la collection de "madre o acompañado o paciente"
      // Tambien eliminar el servicio que tiene la madre 
      
      
      // Actualizar el estado local después de eliminar el documento
      setMatches((prevMatches) =>
        prevMatches.filter((match) => match.idFirestore !== matchId)
      );
      console.log(`Match con ID ${matchId} eliminado exitosamente.`);
    } catch (error) {
      console.error("Error al eliminar el match:", error);
    }
  };
//console.log(matches?.mother,'matches');

  return (
    <div className="mt-6 bg-gray-200 shadow rounded p-4 w-full max-w-4xl">
      <h3 className="text-lg font-bold mb-4">Matches Creados</h3>
      <ul className="space-y-4">
        {matches?.map((match) => (
          <li
            key={match.idFirestore}
            className="p-4 bg-green-100 rounded shadow flex flex-col space-y-2"
          >
            {/* Información de la Niñera */}
            <div className="flex flex-col">
              <h4 className="text-md font-bold text-blue-700">Niñera</h4>
              <p>
                <strong>Nombre:</strong> {match.nanny.name}
              </p>
              <p>
                <strong>Teléfono:</strong> {match.nanny.phone}
              </p>
              <p>
                <strong>Dirección:</strong> {match.nanny.address}
              </p>
              <p>
                <strong>Disponibilidad:</strong> {match.nanny.availability}
              </p>
              <p>
                <strong>Barrio:</strong> {match.nanny.neighborhood}
              </p>
            </div>

            {/* Información de la Madre */}
            <div className="flex flex-col">
              <h4 className="text-md font-bold text-pink-700">Madre</h4>
              <p>
                <strong>Nombre:</strong> {match.mother.name}
              </p>
              <p>
                <strong>Número de menores:</strong>{" "}
                {match.mother.numberOfChildren}
              </p>
              <p>
                <strong>Teléfono:</strong> {match.mother.phone}
              </p>
              <p>
                <strong>Dirección:</strong> {match.mother.address}
              </p>
              <p>
                <strong>Barrio:</strong> {match.mother.neighborhood}
              </p>
            </div>

            {/* Botón para eliminar */}
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleDelete(match.idFirestore)}
              >
                Eliminar Match
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
