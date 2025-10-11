import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaMapMarkerAlt, FaTools, FaUserCircle} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Search() {
    const [skill, setSkill] = useState("");
    const [type, setType] = useState("");
    const [location, setLocation] = useState("");
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);

    // habilidades del usuario logueado
    //const [mySkills, setMySkills] = useState([]);
    const [mySkillsOffered, setMySkillsOffered] = useState([]);
    //const [mySkillsWanted, setMySkillsWanted] = useState([]);

    const [selectedSkill, setSelectedSkill] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    // modal
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("offer"); // "offer" o "want"

    const navigate = useNavigate();

    const openModal = (user) => {
        // Si el otro usuario OFRECE algo (type === "offer"),
        // tú eliges qué habilidad ofrecer a cambio.
        if (user.type === "offer") {
        setModalMode("offer");
        setSelectedUser(user);
        setSelectedSkill("");
        setShowModal(true);
        } else {
        // Si el otro usuario BUSCA algo (type === "want"),
        // verificamos si tú tienes esa habilidad.
        const tienesHabilidad = mySkillsOffered.some(
            (s) =>
            s.toLowerCase().includes(user.skill_name.toLowerCase()) ||
            user.skill_name.toLowerCase().includes(s.toLowerCase())
        );

        if (!tienesHabilidad) {
            alert(
            `No puedes enviar solicitud: no tienes la habilidad que ${user.name} está buscando.`
            );
            return;
        }

        // Si sí la tienes, ahora eliges cuál de las habilidades que esa persona ofrece deseas.
        setModalMode("want");
        setSelectedUser(user);
        setSelectedSkill("");
        setShowModal(true);
        }
    };

    const closeModal = () => {
        setSelectedUser(null);
        setSelectedSkill("");
        setShowModal(false);
    };

    const handleSearch = async () => {
        try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/search", {
            params: { skill, type, location },
            headers: { Authorization: `Bearer ${token}` },
        });

        /* eliminar duplicados basados en el id del usuario
        const uniqueResults = res.data.filter(
            (user, index, self) => index === self.findIndex(u => u.id === user.id)
        );*/

        const processedResults = res.data.map(user => ({
            ...user,
            skillsOffered: user.skills_offered ? user.skills_offered.split(", ") : []
        }));
        setResults(processedResults);
        setSearched(true);
        } catch (err) {
        console.error("Error buscando:", err);
        }
    };

    // cargar habilidades del usuario
    useEffect(() => {
        const fetchSkills = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/profile/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMySkillsOffered(res.data.skillsOffered || []);
            //setMySkillsWanted(res.data.skillsWanted || []);
        } catch (err) {
            console.error("Error cargando habilidades del usuario:", err);
        }
        };
        fetchSkills();
    }, []);

    // Envio de solicitud
    const sendRequest = async () => {
        if (!selectedSkill) {
            alert("Debes seleccionar una habilidad que ofreces");
        return;
        }
        try {
            const token = localStorage.getItem("token");
            const body =
                modalMode === "offer"
                ? {
                    received_id: selectedUser.id,
                    skill_offered: selectedSkill, // tú ofreces
                    skill_requested: selectedUser.skill_name, // la del otro
                    }
                : {
                    received_id: selectedUser.id,
                    skill_offered: selectedUser.skill_name, // tú tienes lo que el otro busca
                    skill_requested: selectedSkill, // eliges qué habilidad del otro deseas
                    };

            await axios.post("http://localhost:5000/api/exchanges", body, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Solicitud enviada con éxito");
            closeModal();
        } catch (err) {
            console.error(err);
            alert("Error al enviar la solicitud");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-color7 to-color6 bg-clip-text text-transparent text-center"> Buscar Habilidades</h2>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                    <FaTools className="absolute top-3 left-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Habilidad (ej. guitarra)"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        className="pl-10 border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">Todos</option>
                    <option value="offer">Ofertadas</option>
                    <option value="want">Buscadas</option>
                </select>

                <div className="relative">
                    <FaMapMarkerAlt className="absolute top-3 left-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Ubicación"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="pl-10 border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>

            <div className="flex justify-center mt-4">
                <button
                    onClick={handleSearch}
                    className="flex items-center gap-2 bg-gradient-to-r from-color7 to-color6 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
                >
                    <FaSearch />
                    Buscar
                </button>
            </div>
        
            {/* Botón para volver al perfil */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 text-color3 hover:text-blue-800 font-medium transition duration-300"
                >
                    <FaUserCircle className="text-xl" />
                    Volver al perfil
                </button>
            </div>


            {/* Resultados */}
            <div className="mt-8 space-y-4">
                {searched && results.length === 0 ? (
                    <div className="text-center text-gray-500">
                        <p>No se encontraron coincidencias con tu búsqueda.</p>
                    </div>
                    ) : (
                    results.map((r, idx) => (
                        <div
                            key={idx}
                            className="p-4 bg-white shadow-md rounded-lg border flex items-center justify-between gap-4 hover:shadow-lg transition"
                        >
                            <div className="flex items-center gap-4">
                                {r.avatar_url ? (
                                    <img
                                    src={r.avatar_url}
                                    alt={r.name}
                                    className="w-14 h-14 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                                    {r.name ? r.name.charAt(0).toUpperCase() : "?"}
                                    </div>
                                )}

                                <div>
                                    <h3 className="font-semibold text-lg">{r.name}</h3>
                                    <p className="text-sm text-gray-600">{r.location}</p>
                                    <p className="text-color7 text-sm">
                                    {r.type === "offer" ? "Ofrece: " : "Busca: "} {r.skill_name}
                                    </p>
                                </div>
                            </div>

                            {/* Botón de abrir modal */}
                            <button
                                onClick={() => openModal(r)}
                                className="bg-gradient-to-r from-color7 to-color6 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
                            >
                                Enviar solicitud
                            </button>
                        </div>
                    ))
                )}
            </div>
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-96">
                        {modalMode === "offer" ? (
                            <>
                                <h3 className="text-lg font-semibold mb-4">
                                Selecciona una habilidad para ofrecer
                                </h3>
                                <select
                                value={selectedSkill}
                                onChange={(e) => setSelectedSkill(e.target.value)}
                                className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                                >
                                <option value="">-- Selecciona una habilidad --</option>
                                {mySkillsOffered.map((s, idx) => (
                                    <option key={idx} value={s}>
                                    {s}
                                    </option>
                                ))}
                                </select>
                            </>
                            ) : (
                            <>
                                <h3 className="text-lg font-semibold mb-4">
                                Selecciona qué habilidad deseas del otro usuario
                                </h3>
                                <select
                                    value={selectedSkill}
                                    onChange={(e) => setSelectedSkill(e.target.value)}
                                    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                                >
                                <option value="">-- Selecciona una habilidad --</option>
                                {selectedUser.skillsOffered?.map((s, idx) => (
                                    <option key={idx} value={s}>
                                    {s}
                                    </option>
                                ))}
                                </select>
                            </>
                        )}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={sendRequest}
                                className="px-4 py-2 rounded-md bg-gradient-to-r from-color7 to-color6 text-white hover:opacity-90"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Search;