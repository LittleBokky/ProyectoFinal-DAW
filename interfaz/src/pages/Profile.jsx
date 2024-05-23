import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Profile = () => {
    const [zapatillas, setZapatillas] = useState([]);

    useEffect(() => {
        const fetchZapatillas = async () => {
            try {
                const response = await fetch('http://localhost:8000/zapatillas');
                const data = await response.json();
                setZapatillas(data);
            } catch (error) {
                console.error('Error fetching zapatillas:', error);
            }
        };

        fetchZapatillas();
    }, []);

    return (
        <Container className="mt-5">
            <Row>
                {zapatillas.map((zapatilla) => (
                    <Col key={zapatilla.id} md={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{zapatilla.name}</Card.Title>
                                <Card.Text>
                                    Price: ${zapatilla.price}
                                </Card.Text>
                                <div>
                                    {zapatilla.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Zapatilla ${zapatilla.name}`}
                                            className="img-fluid"
                                        />
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Profile;
