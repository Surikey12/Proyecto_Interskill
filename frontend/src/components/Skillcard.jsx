import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";

function Skillcard({ title, skills, type }) {
  const [adding, setAdding] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/profile/skills`,
        { skill: newSkill, type }, // type: "offered" o "wanted"
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.reload(); // recargamos para ver el cambio
    } catch (err) {
      console.error("Error agregando habilidad:", err);
    }
  };

  const deleteSkill = async (skill) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/profile/skills/${encodeURIComponent(skill)}/${type}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.reload();
    } catch (err) {
      console.error("Error eliminando habilidad:", err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 relative">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          onClick={() => setAdding(!adding)}
          className="text-blue-600 hover:text-blue-800"
        >
          <FaPlus />
        </button>
      </div>

      {skills.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1">
          {skills.map((skill, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <span>{skill}</span>
              <button
                onClick={() => deleteSkill(skill)}
                className="text-red-500 hover:text-red-700 ml-3"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Aún no se han agregado habilidades</p>
      )}

      {adding && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Nueva habilidad"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="border rounded-lg px-2 py-1 flex-1"
          />
          <button
            onClick={addSkill}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  );
}

export default Skillcard;
