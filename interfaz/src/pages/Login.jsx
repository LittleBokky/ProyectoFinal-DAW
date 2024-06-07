import React, { useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom"; // Importa Link de react-router-dom
import { fetchUserDataUsingToken } from "../utils/userUtils";
import "../styles/Login.css"; // Importa el archivo CSS

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to login");
      }

      const data = await response.json();

      const userSession = data.user;
      const token = data.token;
      const userId = data.user_id;

      localStorage.setItem("userSession", userSession);
      localStorage.setItem("user_id", userId);
      localStorage.setItem("token", token);

      Swal.fire({
        icon: "success",
        title: `¡Bienvenido a Refootwear, ${userSession}!`,
        showConfirmButton: false,
        timer: 2500,
      }).then(() => {
        window.location.href = "/";
      });

    } catch (error) {
      console.error("Error:", error.message);
      Swal.fire({
        icon: "error",
        title: "Algo salió mal...",
        text: "Usuario y/o contraseña incorrectos",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-row">
        <div className="login-card">
          <div className="login-card-body">
            <h2 className="login-title">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} method="POST">
              <div className="login-form-group">
                <label htmlFor="formUsername">Nombre de usuario:</label>
                <input
                  type="text"
                  id="formUsername"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="login-form-control"
                />
              </div>
              <div className="login-form-group">
                <label htmlFor="formPassword">Contraseña:</label>
                <input
                  type="password"
                  id="formPassword"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="login-form-control"
                />
              </div>
              <button type="submit" className="login-button">Iniciar sesión</button>
              <Link to="/register">
                <button type="button" className="login-button">¿No tienes cuenta? Registrate aqui</button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
