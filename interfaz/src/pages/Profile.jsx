import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import '../styles/Profile.css';

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
            const response = await fetch(`http://localhost:8000/zapatillas/zapatillaUsuario`);
            const data = await response.json();
            setZapatillas(data);
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

        const userId = localStorage.getItem('user_id');

        let profileImageBase64 = null;
        if (profileImage) {
            const reader = new FileReader();
            reader.readAsDataURL(profileImage);
            reader.onloadend = async () => {
                profileImageBase64 = reader.result;

                const body = JSON.stringify({
                    username: username,
                    profileImage: profileImageBase64
                });

                try {
                    const response = await fetch(`http://localhost:8000/user/${userId}/update`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: body
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update profile');
                    }

                    const data = await response.json();
                    setUsername(data.username);
                    setProfileImageUrl(data.profileImageUrl);

                    setAlertMessage('Profile updated successfully');
                } catch (error) {
                    console.error('Error updating profile:', error);
                    setAlertMessage('Error updating profile');
                }
            };
        } else {
            const body = JSON.stringify({
                username: username
            });

            try {
                const response = await fetch(`http://localhost:8000/user/${userId}/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: body
                });

                if (!response.ok) {
                    throw new Error('Failed to update profile');
                }

                const data = await response.json();
                setUsername(data.username);
                setProfileImageUrl(data.profileImageUrl);

                setAlertMessage('Profile updated successfully');
            } catch (error) {
                console.error('Error updating profile:', error);
                setAlertMessage('Error updating profile');
            }
        }
    };

    return (
        <Container className="mt-5">
            {alertMessage && <Alert variant="info">{alertMessage}</Alert>}
            <Row className="mb-5">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <div className='profile-info'>
                            <Card.Title className='profile-title'>Welcome, {userData.username}!</Card.Title>
                            {userData.avatar && (
                                <div className="mb-3 text-center">
                                  <img
                                    src={userData.avatar}
                                    alt="Profile Avatar"
                                    className="img-fluid rounded-circle profile-avatar"
                                    // Añade la clase 'profile-avatar' para hacer la imagen más grande
                                    style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                        </div> 
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mb-5">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Edit Profile</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        onChange={handleUsernameChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formProfileImage" className="mt-3">
                                    <Form.Label>Profile Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={handleProfileImageChange}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="mt-3">
                                    Save Changes
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Resto del código */}
        </Container>
    );
};

export default Profile;
