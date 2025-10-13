import { Link } from "react-router-dom";
import Logo from "../pages/images/logo2.png"

function Navbar() {
    //const userId = localStorage.getItem("userId");
    //console.log(userId);
    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
            <div className="flex">
                <img src={Logo} alt="Logo" className="w-8 h-8 rounded-full" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-color7 to-color6 bg-clip-text text-transparent">InterSkill</h1>
            </div>  
            <ul className="flex gap-6">
                <li>
                <Link to="/profile" className="hover:text-color8">
                    Perfil
                </Link>
                </li>
                <li>
                <Link to="/search" className="hover:text-color8">
                    Buscar
                </Link>
                </li>
                <li>
                <Link to="/exchanges" className="hover:text-color8">
                    Solicitudes
                </Link>
                </li>
                <li>
                <Link to="/chat" className="hover:text-color8">
                    Chats
                </Link>
                </li>
                <li>
                <Link to="/history" className="hover:text-color8">
                    Historial
                </Link>
                </li>
                <li>
                <Link to="/" className="hover:text-color8">
                    Cerrar Sesión
                </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
