import React, { useState } from "react";

export default function ServiceList({ services }) {
  const [expandedServiceIndex, setExpandedServiceIndex] = useState(null);

  const toggleServiceDetails = (index) => {
    setExpandedServiceIndex(index === expandedServiceIndex ? null : index);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Servicios Contratados: {services?.length || 0}
      </h2>
      {services?.length > 0 ? (
        <ul className="space-y-4">
          {services.map((service, index) => (
            <li
              key={index}
              className="p-4 bg-blue-50 rounded-lg shadow hover:shadow-md transition"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleServiceDetails(index)}
              >
                <p className="text-lg font-semibold text-gray-800">
                  {service?.contratacion || "Servicio no especificado"}
                </p>
                <button className="text-blue-600 hover:underline">
                  {expandedServiceIndex === index ? "Ocultar detalles" : "Ver detalles"}
                </button>
              </div>
              {expandedServiceIndex === index && (
                <div className="mt-4 space-y-2 bg-white p-4 rounded-lg shadow-inner">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Barrio/Zona:</span> {service?.barrioZona || "No disponible"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Cantidad de niños:</span>{" "}
                    {service?.childer?.length || 0}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Detalles:</span>{" "}
                    {service?.childer?.map((ch,index)=>{
                        return(
                           <div   className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2 shadow-sm">
                            <p>Nombre: {ch.name}</p>
                            <p>Edad: {ch.age}</p>
                            <p>Cuidado Especial: {ch.specialCare}</p>
                            <p>Medicación: {ch.takesMedication?'Si':'No'}</p>
                           </div>
                        )
                    })}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Días:</span>{" "}
                    {service?.days?.join(", ") || "No especificado"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Horario:</span>{" "}
                    {service?.schedule || "No especificado"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Propuesta económica:</span>{" "}
                    {service?.propuestaEconomica || "No especificado"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Tipo:</span>{" "}
                    {service?.plan || "No especificado"}
                  </p>
                  
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Tipo de Contrato:</span>{" "}
                    {service?.typePago || "No especificado"}
                  </p>
                  
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Tipo de Contratación:</span>{" "}
                    {service?.contratacion || "No especificado"}
                  </p>
                  
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No hay servicios contratados.</p>
      )}
    </div>
  );
}
