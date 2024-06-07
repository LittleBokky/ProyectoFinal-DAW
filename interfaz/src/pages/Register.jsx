import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import '../styles/Register.css'; // Importa el archivo CSS para los estilos personalizados

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);

    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('User registered successfully');
                Swal.fire({
                    icon: 'success',
                    title: 'Registrado',
                    text: 'Usuario registrado correctamente',
                });
            } else if (response.status === 409) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Username already exists!',
                });
            } else {
                console.error('Error registering user');
                Swal.fire({
                    icon: 'error',
                    title: 'No puedes registrarte',
                    text: 'Usuario existente',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    };

    return (
        <div className="register-container">
            <div className="register-row">
                <div className="register-card">
                    <div className="register-card-body">
                        <h2 className="register-title">Registrarse</h2>
                        <form onSubmit={handleSubmit} method="POST">
                            <div className="register-form-group">
                                <label htmlFor="formUsername">Nombre de usuario</label>
                                <input
                                    type="text"
                                    id="formUsername"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="register-form-control"
                                    placeholder="Enter username"
                                />
                            </div>
                            <div className="register-form-group">
                                <label htmlFor="formPassword">Contraseña</label>
                                <input
                                    type="password"
                                    id="formPassword"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="register-form-control"
                                    placeholder="Password"
                                />
                            </div>
                            <div className="register-form-group">
                                <label htmlFor="formAvatar">Avatar</label>
                                <input
                                    type="file"
                                    id="formAvatar"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="register-form-control"
                                />
                            </div>
                            <button type="submit" className="register-button">Registrarse</button>
                            <Link to="/login">
                                <button type="button" className="register-button-secondary">¿Tienes cuenta? Inicia sesión aquí</button>
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
