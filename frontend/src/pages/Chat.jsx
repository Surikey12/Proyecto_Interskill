import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import Navbar from "../components/Navbar";

function Chat() {
    const { exchangeId } = useParams();
    const { state } = useLocation();
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    //console.log("Params:", useParams());

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem("userId");
    //const userId = state?.userId;
    const receiverId = state?.receiverId;
    const partnerName = state?.partnerName || "Chat";

    // Desplazar al último mensaje
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Conexión a la sala y carga de mensajes
    useEffect(() => {
        const socket = io("http://localhost:5000");
        socketRef.current = socket;

        // Unirse a la sala
        socket.emit("join_room", exchangeId);

        // Cargar historial
        const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
            `http://localhost:5000/api/messages/${exchangeId}`,
            { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(res.data);
        } catch (err) {
            console.error("Error al cargar mensajes:", err);
        } finally {
            setLoading(false);
        }
        };

        fetchMessages();

        // Escuchar nuevos mensajes
        socket.on("receive_message", (data) => {
        if (data.exchangeId === exchangeId) {
            setMessages((prev) => [...prev, data]);
        }
        });

        return () => {
        socket.disconnect();
        };
    }, [exchangeId]);

    // Scroll automático
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Enviar mensaje
    const sendMessage = () => {
        if (!message.trim()) return;

        const msgData = {
        exchangeId,
        senderId: userId,
        receiverId,
        message,
        timestamp: new Date().toISOString(),
        };

        socketRef.current.emit("send_message", msgData);
        //setMessages((prev) => [...prev, msgData]);
        setMessage("");
    };

    useEffect(() => {
        if (!receiverId) {
            // Si no hay receiverId, redirige al listado
            navigate("/chat");
        }
    }, [receiverId, navigate]);

    const formatTime = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <>
        <Navbar />
            <div className="max-w-2xl mx-auto mt-10 border rounded-lg shadow p-4 bg-white">
                <h2 className="text-lg font-bold mb-2 text-center text-color7">
                Chat con {partnerName}
                </h2>

                <div className="h-96 overflow-y-auto border rounded-md p-2 mb-2 bg-gray-50">
                {loading ? (
                    <p className="text-center text-gray-500">Cargando mensajes...</p>
                ) : messages.length === 0 ? (
                    <p className="text-center text-gray-400">No hay mensajes aún.</p>
                ) : (
                    messages.map((msg, i) => {
                        // Normalizamos el nombre del campo para compatibilidad
                        const sender = msg.senderId || msg.sender_id;
                        const content = msg.message || msg.content;
                        const time = msg.timestamp || msg.created_at;
                        const isMine = String(sender) === String(userId); //ver si se conserva o se quita 
                        return (
                            <div
                                key={i}
                                className={`flex flex-col my-2 ${
                                    isMine ? "items-end" : "items-start"
                                }`}
                            >
                            <div
                                className={`p-3 rounded-2xl shadow max-w-[80%] ${
                                isMine
                                    ? "bg-color7 text-white rounded-br-none"
                                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                                }`}
                            >
                                {content}
                            </div>
                                <span
                                    className={`text-xs mt-1 ${
                                    isMine ? "text-right text-gray-300" : "text-gray-500"
                                    }`}
                                >
                                    {formatTime(time)}
                                </span>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
                </div>
                {/* Campos de mensajes */}
                <div className="p-3 border-t flex gap-2 items-center bg-white">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-color6"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-color6 text-white px-4 py-2 rounded-full hover:bg-color7 transition"
                    >
                        Enviar
                    </button>
                </div>

                <button
                    onClick={() => navigate("/chat")}
                    className="mt-3 text-sm text-gray-500 hover:text-gray-700"
                    >
                    Volver a conversaciones
                </button>
            </div>
        </>
    );
}

export default Chat;
