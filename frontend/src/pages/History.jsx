import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Historial() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/exchanges/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data);
      } catch (err) {
        setError("Error al cargar el historial de intercambios.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Simula tu ID actual (puedes obtenerlo del token o localStorage)
  const currentUserId = parseInt(localStorage.getItem("userId"));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-color7 to-color6 bg-clip-text text-transparent mb-6 text-center">
          Historial de Intercambios
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Cargando historial...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-600">
            No tienes intercambios registrados aún.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {history.map((exchange) => {
              // Determina con quién fue el intercambio
              const sentByUser = exchange.sender_id === currentUserId;
              const withPerson = sentByUser ? exchange.receiverName : exchange.senderName;
              const actionText = sentByUser ? "Intercambiaste" : "Aceptaste intercambiar";
              return (
                <div
                  key={exchange.id}
                  className={`p-5 rounded-xl shadow-md border-l-4 transition-all ${
                    exchange.status === "accepted"
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                  }`}
                >
                  <h2 className="text-lg font-semibold text-gray-800">
                    {actionText}{" "}
                    <span className="font-bold">{exchange.skill_offered}</span> por{" "}
                    <span className="font-bold">{exchange.skill_requested}</span> con{" "}
                    <span className="text-color8">{withPerson}</span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Estado:{" "}
                    <span
                      className={`${
                        exchange.status === "accepted"
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }`}
                    >
                      {exchange.status === "accepted" ? "Aceptado" : "Rechazado"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Última actualización:{" "}
                    {new Date(exchange.updated_at).toLocaleDateString("es-MX")}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Historial;
