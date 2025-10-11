import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function ChatList() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  //const location = useLocation();
  //const { userId } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`http://localhost:5000/api/chats/${userId}`);
        // Aseguramos que cada conversación muestre el último mensaje, no el primero
        const formatted = res.data.map((conv) => ({
          ...conv,
          lastMessage: conv.lastMessage || "Sin mensajes aún",
          updatedAt: conv.updatedAt,
        }));

        setConversations(formatted);
      } catch (err) {
        console.error("Error al obtener las conversaciones:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleOpenChat = (chatId, partnerName, partnerId) => {
    console.log("Navegando al chat:", chatId);
    navigate(`/chat/${chatId}`, { state: { partnerName, receiverId: partnerId } });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    // Mostrar solo la hora si es de hoy
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    // Sino, mostrar fecha corta
    return date.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Cargando conversaciones...</p>
      </div>
    );
  }
  //console.log("Conversaciones:", conversations);
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 p-4">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-color7 to-color6 bg-clip-text text-transparent text-center">Mis Conversaciones</h2>

        {conversations.length === 0 ? (
          <p className="text-center text-gray-500">
            No tienes conversaciones todavía.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            
            {conversations.map((conv) => (
              <li
                key={conv.chat_id}
                onClick={() => handleOpenChat(conv.chat_id, conv.partnerName, conv.partnerId)}
                className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer 
                           hover:shadow-md hover:bg-gray-50 transition-all duration-200 flex justify-between items-center"
              >
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold">{conv.partnerName}</h3>
                  <p className="text-sm text-gray-500">
                    Último mensaje: {conv.lastMessage || "Sin mensajes aún"}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(conv.updatedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default ChatList;
