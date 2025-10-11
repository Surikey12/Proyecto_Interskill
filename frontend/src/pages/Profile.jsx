import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import UserAvatar from "../components/UserAvatar";
import Skillcard from "../components/Skillcard";
import { FaEdit} from "react-icons/fa";


function Profile() {
  const [profile, setProfile] = useState(null);
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [editingLocation, setEditingLocation] = useState(false);
  const [newLocation, setNewLocation] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // --- Captura el token desde la URL (cuando vienes de Google OAuth) ---
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // limpiamos la URL para que no quede el token visible
      navigate("/profile", { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("token en frontend: ", token); //
        console.log("headers enviados:", { Authorization: `Bearer ${token}` }); //Se esta enviando?
        const res = await axios.get("http://localhost:5000/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProfile(res.data);
        setNewBio(res.data.bio || "");
        setNewLocation(res.data.location || "");
      } catch (err) {
        console.error("Error obteniendo perfil", err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Cargando perfil...</p>;


  const saveBio = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/profile/bio",
        { bio: newBio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile({ ...profile, bio: newBio });
      setEditingBio(false);
    } catch (err) {
      console.error("Error guardando bio:", err);
    }
  };

    const saveLocation = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/profile/location",
        { location: newLocation },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile({ ...profile, location: newLocation });
      setEditingLocation(false);
    } catch (err) {
      console.error("Error guardando ubicación:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        {/* Avatar e información */}
        <div className="flex items-center gap-4 bg-white shadow-md rounded-xl p-6 mb-6">
          <UserAvatar name={profile.name} image={profile.avatar} />
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
            {/* Ubicación */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Ubicación</h3>
                <button
                  onClick={() => setEditingLocation(!editingLocation)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <FaEdit />
                </button>
              </div>

              {editingLocation ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="border rounded-lg px-2 py-1"
                  />
                  <button
                    onClick={saveLocation}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg self-start"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">
                  {profile.location || "Ubicación no definida"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Biografía */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-6 relative">
          <h3 className="text-lg font-semibold mb-3 flex justify-between items-center">
            Biografía
            <button
              onClick={() => setEditingBio(!editingBio)}
              className="text-gray-500 hover:text-blue-600"
            >
              <FaEdit />
            </button>
          </h3>

          {editingBio ? (
            <div>
              <textarea
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                className="w-full border rounded-lg p-2 mb-2"
              />
              <button
                onClick={saveBio}
                className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          ) : (
            <p className="text-gray-700">
              {profile.bio && profile.bio.trim() !== ""
                ? profile.bio
                : "Aún no has escrito tu biografía"}
            </p>
          )}
        </div>

        {/* Habilidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skillcard title="Habilidades Ofertadas" skills={profile.skillsOffered || []} type="offer"/>
          <Skillcard title="Habilidades Buscadas" skills={profile.skillsWanted || []} type="want" />
        </div>
      </div>
    </div>
  );
}

export default Profile;
