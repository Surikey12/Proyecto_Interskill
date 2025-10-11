import { useState } from "react";
import imgLogo from "./images/img_principal.png";
import Logo from "./images/logo2.png"

function Home() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-color7 to-color6 text-white">
      {/* Barra de navegación */}
      <nav className="w-full flex items-center justify-between px-8 py-4 from-color7 to-color6 shadow-md">
        {/* Logo con botón */}
        <div className="flex items-center space-x-3">
          <img src={Logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <button
            onClick={() => setShowInfo(true)}
            className="text-2xl font-bold text-white hover:text-color3 transition-colors"
          >
            InterSkill
          </button>
        </div>

        {/* Aquí van los demás botones */}
        <div className="flex">
          <a
            href="/login"
            className="h-full flex items-center px-10 text-gl font-semibold text-white hover:bg-color1 transition-colors"
          >
            INICIAR SESIÓN
          </a>
          <a
            href="/login"
            className="h-full flex items-center px-10 text-gl font-semibold text-white hover:bg-color1 transition-colors"
          >
            REGISTRARSE
          </a>
        </div>
      </nav>

      {/* Contenido principal dividido en 2 columnas */}
      <div className="flex flex-grow">
        {/* Columna izquierda: texto centrado */}
        <div className="w-1/2 flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 text-center">InterSkill</h1>
            <p className="text-xl mb-8 " >
              Conecta, intercambia, crece. Comparte lo que sabes, aprende lo que
              sueñas.
            </p>
            <br></br>
            <a
              href="/login"
              className="bg-color1 text-white text-xl px-10 py-5 rounded-2xl shadow-lg font-semibold hover:bg-color3 transition-colors "
            >
              COMENZAR
            </a>
          </div>
        </div>

        {/* Columna derecha: imagen */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src={imgLogo}
            alt="Ilustración de intercambio de habilidades"
            className="max-w-xl w-full rounded-2xl "
          />
        </div>
      </div>

      {/* Modal Info */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-color5 p-8 rounded-2xl max-w-md shadow-xl flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-color1 text-center">
              ¿Qué es InterSkill?
            </h2>
            <p className="mb-6 text-gray-700 text-justify">
              InterSkill es una plataforma comunitaria donde las personas pueden
              intercambiar sus habilidades: aprende algo nuevo mientras enseñas
              lo que sabes. Cocina, música, tecnología y mucho más.
            </p>
            <button
              onClick={() => setShowInfo(false)}
              className="bg-color1 text-white px-4 py-2 rounded-lg hover:bg-color3 transition-colors "
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;