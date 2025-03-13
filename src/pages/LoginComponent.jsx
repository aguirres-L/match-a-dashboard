import React, { useState } from "react";
import { getDocumentsFirebase } from "../services/data-firebase";
import logoNiñeraYa from "../assets/logo-niñeras-ya.JPG";

const LoginComponent = ({ setIsUserVerification }) => {
  // Estados para manejar los datos del formulario
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Función para manejar el envío del formulario
  const handleLogin = async (e) => {
    e.preventDefault(); // Evitar que el formulario se envíe automáticamente

    // Validar que los campos no estén vacíos
    if (!username || !password) {
      setError("Por favor, ingresa tu nombre de usuario y contraseña.");
      return;
    }

    try {
      // Obtener los datos de la colección "user-manager" de Firebase
      const users = await getDocumentsFirebase("user-manager");

      // Buscar si el usuario existe en la colección
      const userExists = users.find(
        (user) => user.name === username && user.password === password
      );

      if (userExists) {
        // Usuario válido
        setError("");
        setIsUserVerification(true);
      } else {
        // Usuario no encontrado o contraseña incorrecta
        setError("Nombre de usuario o contraseña incorrectos.");
      }
    } catch (error) {
      console.error("Error al obtener los datos de Firebase:", error);
      setError("Ocurrió un error al intentar iniciar sesión.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#f9d6ec] to-[#f0b3d9]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 transform transition-all duration-300 hover:shadow-2xl">
        {/* Logo y Título */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={logoNiñeraYa}
            className="w-24 h-24 rounded-full shadow-md border-4 border-[#e085cf]"
            alt="Niñeras-YA"
          />
          <h1 className="text-3xl font-bold mt-4">
            <span className="text-[#e085cf]">Niñeras-YA!</span>{" "}
            <span className="text-gray-800">Manager</span>
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Gestiona tu agencia de niñeras de manera eficiente.
          </p>
        </div>

        {/* Formulario de Login */}
        <form onSubmit={handleLogin}>
          {/* Campo de nombre de usuario */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e085cf] focus:border-transparent transition-all"
              placeholder="Ingresa tu nombre de usuario"
            />
          </div>

          {/* Campo de contraseña */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e085cf] focus:border-transparent transition-all"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            className="w-full bg-[#e085cf] text-white py-2 rounded-lg hover:bg-[#d973b8] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#e085cf] focus:ring-offset-2"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;  