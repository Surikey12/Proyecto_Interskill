import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import fondo from "./images/fondo_login.jpg"

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); //Constante para pasar de paginas
  
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones
    if (!form.email || !form.password || (isRegister && !form.name)) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (isRegister) {
      // Nombre sin números
      const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
      if (!nameRegex.test(form.name)){
        setError("El nombre solo puede contener letras y espacios");
        return;
      }
    }

    // Contraseña minima de 8 caracteres
    if (isRegister) {
      if (form.password.length < 8){
        setError("La contraseña debe tener minimo 8 caracteres");
        return;
      }
    }

    // Confirmación de contraseña 
    if (isRegister && form.password !== form.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      if (isRegister) {
        await axios.post("http://localhost:5000/api/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password
        });
        setSuccess("Registrado correctamente, ahora inicia sesión");
        setIsRegister(false);
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: form.email,
          password: form.password
        });
        console.log("Usuario logueado:", res.data);

        // Guardar el tocken 
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user.id);
        setSuccess(`Bienvenido ${res.data.user.name}`);
        navigate("/profile")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error del servidor");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-color7 to-color6">
      {/* Tarjeta grande centrada */}
      <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Sección izquierda con IMAGEN de fondo */}
        <div
          className="hidden md:flex w-1/2 bg-cover bg-center items-center justify-center text-white p-10"
          style={{
            backgroundImage:
              `url(${fondo})`,
          }}
        >
          <div className="p-6 rounded-xl text-center">
            <h1 className="text-3xl font-bold mb-4">Bienvenido a InterSkill</h1>
            <p className="text-lg text-justify">
              ¿Tienes una habilidad que te apasiona? ¿Te gustaria aprender algo nuevo? En nuestra plataforma, el conocimiento se convierte en moneda de cambio. Aqui todos somos estudiantes y maestros. Ya sea programación, cocina, idiomas, 
              arte, música o cualquier otra habilidad, puedes intercambiar tu experiencia por nuevas oportunidades de aprendizaje.
            </p>
          </div>
        </div>

        {/* Sección derecha con formulario */}
        <div className="w-full md:w-1/2 p-10 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
              {isRegister ? "CREAR CUENTA" : "INICIAR SESIÓN"}
            </h1>
            {/* Alertas */} 
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-400 text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-md bg-green-100 border border-green-400 text-green-700 text-sm">
                {success}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {isRegister && (
                <input
                  type="text"
                  name = "name"
                  placeholder="Nombre"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              {isRegister && (
                <input
                  type="password"
                  name="confirm"
                  placeholder="Confirmar contraseña"
                  value={form.confirm}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-color9 to-color7 text-white p-3 rounded-md font-semibold hover:opacity-90 transition"
              >
                {isRegister ? "Registrarse" : "Ingresar"}
              </button>
            </form>

            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError(""); //Limpiamos mensajes de error
                setSuccess(""); // Limpiamos mensajes de exito
                setForm({name: "", email:"", password: "", confirm: ""}); //Limpiar los inputs
              }}
              className="mt-4 w-full text-sm text-indigo-600 hover:underline"
            >
              {isRegister
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </button>

            <div className="mt-6">
              <a
                href="http://localhost:5000/api/auth/google"
                className="w-full border p-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100"
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Ingresar con Google
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;