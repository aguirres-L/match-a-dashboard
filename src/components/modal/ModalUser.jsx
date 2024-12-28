
import Modal from "react-modal";

export default function ModalUser({isModalOpen,closeModal,selectedItem}){
    return(
              <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto"
                overlayClassName="bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center"
              >
                {selectedItem && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">
                      Detalles de {selectedItem.userType === "nana" ? "Niñera" : "Madre"}
                    </h2>
                    <p><strong>Nombre:</strong> {selectedItem.name}</p>
                    <p><strong>Correo:</strong> {selectedItem.email}</p>
                    <p><strong>Teléfono:</strong> {selectedItem.phone}</p>
                    <p><strong>Dirección:</strong> {selectedItem.address}</p>
                    <p><strong>Barrio:</strong> {selectedItem.neighborhood}</p>
                    <p><strong>Disponibilidad:</strong> {selectedItem.availability || "N/A"}</p>
                    <button
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                      onClick={closeModal}
                    >
                      Cerrar
                    </button>
                  </div>
                )}
              </Modal>
    )
}