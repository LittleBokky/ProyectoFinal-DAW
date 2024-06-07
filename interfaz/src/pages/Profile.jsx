import React, { useEffect, useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import '../styles/Profile.css';
import Compras from '../components/Compras';

const Profile = () => {
    const [userData, setUserData] = useState([]);
    const [zapatillas, setZapatillas] = useState([]);
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        fetchUserProfile();
        fetchUserZapatillas();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            const response = await fetch(`http://localhost:8000/user/${userId}`);
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setAlertMessage('Error fetching user profile');
        }
    };

    const fetchUserZapatillas = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                throw new Error('No user ID found in session');
            }
            const response = await fetch(`http://localhost:8000/user/${userId}/zapatillas`);
            const data = await response.json();
            setZapatillas(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching zapatillas:', error);
        }
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        const userId = localStorage.getItem('user_id');

        try {
            const response = await fetch(`http://localhost:8000/user/${userId}/update`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const data = await response.json();
            setUserData(data);

            setAlertMessage('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            setAlertMessage('Error updating profile');
        }
    };

    return (
        <Container className="mt-5">
            {alertMessage && <Alert variant="info">{alertMessage}</Alert>}
            <div className="mb-5">
                <Card style={{ minWidth: '400px', minHeight: '400px' }} className="mb-4">
                    <Card.Body>
                        <div className='profile-info'>
                            <Card.Title className='profile-title'>{userData.username}</Card.Title>
                            {userData.avatar && (
                                <div className="mb-3 text-center">
                                    <img
                                        src={userData.avatar}
                                        alt="Profile Avatar"
                                        className="img-fluid rounded-circle profile-avatar"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                        </div>
                    </Card.Body>
                </Card>
                <Card style={{ minWidth: '400px', minHeight: '400px' }} className="mb-4">
                    <Card.Body>
                        <Card.Title>Editar perfil</Card.Title>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formUsername">
                                <Form.Label>Nombre de usuario</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={username}
                                    onChange={handleUsernameChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formProfileImage" className="mt-3">
                                <Form.Label>Avatar</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleProfileImageChange}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-3">Guardar cambios</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
            <div>
                <h2>Mis ventas</h2>
                <div>
                    {zapatillas.map((zapatilla) => (
                        <Card key={zapatilla.id} className="mb-4">
                            <Card.Img variant="top" src={zapatilla.image} />
                            <Card.Body>
                                <Card.Title>{zapatilla.marca}</Card.Title>
                                <Card.Title>{zapatilla.name}</Card.Title>
                                <Card.Text>
                                    Price: ${zapatilla.price}
                                </Card.Text>
                                <Card.Text>
                                    Size: {zapatilla.size}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
                <Compras />
            </div>
        </Container>
    );
};

export default Profile;
