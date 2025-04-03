import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SvgCloseX from "../svg/SvgCloseX";
import { addDocumentFirebase, deleteDocumentFirebase, getDocumentsFirebase } from "../../services/data-firebase";
import SvgInstagram from "../svg/SvgInstagram";
import SvgImg from "../svg/SvgImg";

const MediaManager = ({ onClose }) => {
  const [reels, setReels] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [isReel, setIsReel] = useState(true);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const getAllUrls = async () => {
      try {
        let urlRell = await getDocumentsFirebase("url-reel");
        let urllSlider = await getDocumentsFirebase("url-slider");

        setReels(urlRell);
        setSliderImages(urllSlider);
      } catch (error) {
        console.error(error, "error get all url from firebase");
      }
    };
    getAllUrls();
  }, []);

  console.log(reels, sliderImages, "url from slider ande reels form instagram from firebase");

  const closeModal = () => {
    onClose();
  };

  const addUrl = async () => {
    if (newUrl.trim() === "") {
      setAlertMessage("Por favor, ingresa una URL.");
      setIsAlertOpen(true);
      return;
    }

    if (isReel) {
      try {
        const newReel = { url: newUrl, idFirestore: Date.now().toString() }; // Mock ID for new reel
        await addDocumentFirebase("url-reel", newReel);
        setReels([...reels, newReel]); // Add new reel with ID
        setNewUrl("");
      } catch (error) {
        setAlertMessage("Error al guardar la URL en Firestore.");
        setIsAlertOpen(true);
        console.error("Error al guardar en Firestore:", error);
      }
    } else {
      try {
        const newImage = { url: newUrl, idFirestore: Date.now().toString() }; // Mock ID for new image
        await addDocumentFirebase("url-slider", newImage);
        setSliderImages([...sliderImages, newImage]); // Add new image with ID
        setNewUrl("");
      } catch (error) {
        setAlertMessage("Error al guardar la URL en Firestore.");
        setIsAlertOpen(true);
        console.error("Error al guardar en Firestore:", error);
      }
    }
  };

  const removeUrl = (index, isReel, idFirestore) => {
    if (!idFirestore) {
      console.error("idFirestore is undefined for the item being deleted.");
      return;
    }

    if (isReel) {
      deleteDocumentFirebase("url-reel", idFirestore);
      setReels(reels.filter((_, i) => i !== index));
    } else {
      deleteDocumentFirebase("url-slider", idFirestore);
      setSliderImages(sliderImages.filter((_, i) => i !== index));
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto p-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gestor de Medios</h1>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <SvgCloseX />
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Pega la URL aquí"
              className="border p-2 rounded mr-2 w-full md:w-auto"
            />
            <select
              value={isReel ? "reel" : "image"} // Corrected value logic
              onChange={(e) => setIsReel(e.target.value === "reel")} // Corrected onChange logic
              className="border p-2 rounded mr-2 mt-2 md:mt-0"
            >
              <option value="reel">Reel</option>
              <option value="image">Imagen del Slider</option>
            </select>
            <button
              onClick={addUrl}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-2 md:mt-0 w-full md:w-auto"
            >
              Agregar
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">
              Imágenes del Slider <SvgImg />
            </h2>
            {sliderImages.length === 0 ? (
              <p className="text-gray-500">No hay imágenes agregadas.</p>
            ) : (
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {sliderImages.map((image, index) => (
                  <motion.li
                    key={index}
                    className="relative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={image.url}
                      alt={`Slider ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      onClick={() => removeUrl(index, false, image.idFirestore)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              Reels de Instagram <SvgInstagram />
            </h2>
            {reels.length === 0 ? (
              <p className="text-gray-500">No hay reels agregados.</p>
            ) : (
              <ul>
                {reels.map((reel, index) => (
                  <motion.li
                    key={index}
                    className="mb-2 flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a
                      href={reel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Reel {index + 1}
                    </a>
                    <button
                      onClick={() => removeUrl(index, true, reel.idFirestore)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </motion.div>

      {isAlertOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 lg:w-1/3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center text-red-700 mb-4">
              <p>{alertMessage}</p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setIsAlertOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default MediaManager;