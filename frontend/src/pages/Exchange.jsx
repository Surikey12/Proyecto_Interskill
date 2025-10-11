import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Chat from "./Chat";

function Exchanges() {
  const [exchanges, setExchanges] = useState([]);
  const [filter, setFilter] = useState("all");
  const [userId, setUserId] = useState(null);
  const [toast, setToast] = useState({message: "", type: ""});
  const [activeChat, setActiveChat] = useState(null);
  //const userId = localStorage.getItem("userId");

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/exchanges", {
          headers: { Authorization: `Bearer ${token}` }
        });
        //console.log("Datos recibidos:", res.data);
        setExchanges(res.data.exchanges || []);
        setUserId(Number(res.data.userId));
        //console.log("Usuario:", res.data.userId);

      } catch (err) {
        console.error(err);
      }
    };
    fetchExchanges();
  }, []);

  const handleAction = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/exchanges/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExchanges((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
      // Si la solicitud es rechazada
      if (status === "rejected") {
        showToast("Has rechazado la solicitud de intercambio.", "error");
      } else if (status === "accepted") {
        showToast("Has aceptado la solicitud. Ahora ambos pueden enviar mensajes.", "success");
      }
    } catch (err) {
      console.error(err);
    }
  };

  
  const filteredExchanges = exchanges.filter((ex) => {
    if (filter === "sent") return ex.sender_id === userId && ex.status === "pending";
    if (filter === "received") return ex.received_id === userId && ex.status === "pending";
    if (filter === "accepted")
      return ex.status === "accepted" && (ex.sender_id === userId || ex.received_id === userId);
    return true;
  });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(()=> setToast({message: "", type: ""}), 3000); // desaparece en 3s
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />      
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl shadow-lg mt-16">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-color7 to-color6 bg-clip-text text-transparent text-center">
          Solicitudes de intercambio
        </h2>

        {/* Filtros */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${
              filter === "all" ? "bg-color7 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("all")}
          >
            Todas
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filter === "sent" ? "bg-color7 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("sent")}
          >
            Enviadas
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filter === "received" ? "bg-color7 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("received")}
          >
            Recibidas
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              filter === "accepted" ? "bg-color7 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("accepted")}
          >
            Aceptadas
          </button>
        </div>

        {filteredExchanges.length === 0 ? (
          <p className="text-center text-gray-500">No hay solicitudes en esta categoría.</p>
        ) : (
          <div className="space-y-4">
            {filteredExchanges.map((ex) => (
              <div
                key={ex.id}
                className="p-4 bg-white rounded-lg shadow-md border hover:shadow-lg transition"
              >
                <p className="text-gray-700 mb-2">
                  {ex.sender_id === userId ? (
                    <>
                      Enviaste una solicitud de intercambio de{" "}
                      <span className="font-semibold text-color6">{ex.skill_offered}</span> por{" "}
                      <span className="font-semibold text-color6">{ex.skill_requested}</span> a{" "}
                      <span className="font-sem
                      ibold text-color7">{ex.received_name}</span>.
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-color7">{ex.sender_name}</span> quiere intercambiar{" "}
                      <span className="font-semibold text-color6">{ex.skill_offered}</span> por{" "}
                      <span className="font-semibold text-color6">{ex.skill_requested}</span>.
                    </>
                  )}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Estado:{" "}
                  <span
                    className={`font-medium ${
                      ex.status === "pending"
                        ? "text-yellow-600"
                        : ex.status === "accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {ex.status}
                  </span>
                </p>

                {ex.status === "pending" && ex.received_id === userId && (
                  <div className="flex gap-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
                      onClick={() => handleAction(ex.id, "accepted")}
                    >
                      Aceptar
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
                      onClick={() => handleAction(ex.id, "rejected")}
                    >
                      Rechazar
                    </button>
                  </div>
                )}

                {ex.status === "accepted" && (ex.sender_id === userId || ex.received_id === userId) && (
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
                      onClick={() =>
                        navigate(`/chat/${ex.id}`, {
                          state: {
                            userId,
                            receiverId: ex.sender_id === userId ? ex.received_id : ex.sender_id,
                            partnerName: ex.sender_id === userId ? ex.received_name : ex.sender_name,
                          },
                        })
                      }
                    >
                      Enviar mensaje
                    </button>
                  </div>
                )}

                {toast.message && (
                  <div
                    className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg text-white transition-opacity
                      ${toast.type === "success" ? "bg-green-500" : ""}
                      ${toast.type === "error" ? "bg-red-500" : ""}
                      ${toast.type === "info" ? "bg-blue-500" : ""}`}
                  >
                    {toast.message}
                  </div>
                )}
              </div>
            ))}

            {/* Si hay un chat activo */}
            {activeChat && (
              <Chat
                exchangeId={activeChat.exchangeId}
                userId={userId}
                receiverId={activeChat.receiverId}
                onClose={() => setActiveChat(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Exchanges;
